'use strict';
import fetch from 'isomorphic-fetch';

export default (method, path, data, start, success, fail) =>
{
	const request =
	{
	    method : method,
	    credentials: 'same-origin',
	    cache : 'no-cache',
	    headers :
	    {
	        'Content-Type' : 'application/json'
	    },
	    body : JSON.stringify(data)
	};
	start();
	fetch(path, request)
	.then((response) =>
	{
		if (response.status === 200)
		{
	    	if (response.headers.get('Content-Type') === 'application/json; charset=utf-8')
	    	{
	    		return response.json().then((json) =>
	    		{
	    			success(json);
	    			if (json.hasOwnProperty('redirect'))
	    			{
	    				browserHistory.push(json.redirect);
	    			}
	    		});
	    	}
	    	//possible other types
	    	else if (response.headers.get('Content-Type') === 'text/html; charset=utf-8')
	    	{
	    		return response.text().then((text) =>
	    		{
	    			console.log(text);
	    			const error = new Error('Server returned html file');
	    			error.response = response;
	    			throw error;
	    		});
	    	}
			else
			{
				const error = new Error('Illegal Content-Type: '
										+ response.headers.get('Content-Type'));
	    		error.response = response;
	    		throw error;
			}
	    }
	    else
	    {
	    	return response.json().then((json) =>
	    	{
	    		fail(json);
	    		if (json.hasOwnProperty('err'))
	    		{
	    			console.log(json.err);
	    		}
	    	})
	    	.catch((e) =>
	    	{
	    		const error = new Error(response.statusText);
	    		error.response = response;
	    		throw error;
	    	});
	    }
	})
	.catch((err) =>
	{
		fail({msg : err.message});
	    console.log(err);
	});
};