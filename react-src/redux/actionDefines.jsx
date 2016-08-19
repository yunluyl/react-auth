'use strict';
import fetch from 'isomorphic-fetch';
import {browserHistory} from 'react-router';
//global defines
export const serverUrl = 'https://localhost:3000';

export const apiRequest = (dispatch, method, url, start, success, fail, data, cookie) =>
{
	return new Promise((resolve, reject) =>
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
		if (cookie)
		{
			request.headers.Cookie = cookie;
		}
		dispatch(start());
		fetch(serverUrl + url, request)
		.then((response) =>
		{
			if (response.status === 200)
			{
		    	if (response.headers.get('Content-Type') === 'application/json; charset=utf-8')
		    	{
		    		return response.json().then((json) =>
		    		{
		    			dispatch(success(json));
		    			if (json.hasOwnProperty('redirect'))
		    			{
		    				browserHistory.push(json.redirect);
		    			}
		    			resolve();
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
		    		dispatch(fail(json));
		    		if (json.hasOwnProperty('err'))
		    		{
		    			console.log(json.err);
		    		}
		    		reject(json);
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
			data = {msg : err.message, recap : true};
			dispatch(fail(data));
		    console.log(err);
		    reject(err);
		});
	});
}

export const mountData = (dispatch, serverRender, getData, data) =>
{
	if (serverRender)
	{
		dispatch({type : SERVER_RENDER_DONE});
	}
	else
	{
		if (getData)
		{
			dispatch(getData(data));
		}
	}
}

//server render
export const SERVER_RENDER_DONE = 'SERVER_RENDER_DONE';

//login form
export const LOGIN_RESET               = 'LOGIN_RESET';
export const LOGIN_SET_EM              = 'LOGIN_SET_EM';
export const LOGIN_RESET_EM            = 'LOGIN_RESET_EM';
export const LOGIN_SET_PW              = 'LOGIN_SET_PW';
export const LOGIN_RESET_PW            = 'LOGIN_RESET_PW';
export const LOGIN_DO_RECAP            = 'LOGIN_DO_RECAP';
export const LOGIN_SET_EM_MSG          = 'LOGIN_SET_EM_MSG';
export const LOGIN_CLEAR_EM_MSG        = 'LOGIN_CLEAR_EM_MSG';
export const LOGIN_SET_PW_MSG          = 'LOGIN_SET_PW_MSG';
export const LOGIN_CLEAR_PW_MSG        = 'LOGIN_CLEAR_PW_MSG';
export const LOGIN_SET_ERR_MSG         = 'LOGIN_SET_ERR_MSG';
export const LOGIN_CLEAR_ERR_MSG       = 'LOGIN_CLEAR_ERR_MSG';
export const LOGIN_START               = 'LOGIN_START';
export const LOGIN_SUCCEED             = 'LOGIN_SUCCEED';
export const LOGIN_FAILED              = 'LOGIN_FAILED';
export const LOGIN_FETCH_RECAP_START   = 'LOGIN_FETCH_RECAP_START';
export const LOGIN_FETCH_RECAP_SUCCEED = 'LOGIN_FETCH_RECAP_SUCCEED';
export const LOGIN_FETCH_RECAP_FAILED  = 'LOGIN_FETCH_RECAP_FAILED';

//signup form
export const SIGNUP_RESET               = 'SIGNUP_RESET';
export const SIGNUP_SET_EM              = 'SIGNUP_SET_EM';
export const SIGNUP_RESET_EM            = 'SIGNUP_RESET_EM';
export const SIGNUP_SET_DN              = 'SIGNUP_SET_DN';
export const SIGNUP_RESET_DN            = 'SIGNUP_RESET_DN';
export const SIGNUP_SET_PW              = 'SIGNUP_SET_PW';
export const SIGNUP_RESET_PW            = 'SIGNUP_RESET_PW';
export const SIGNUP_SET_CPW             = 'SIGNUP_SET_CPW';
export const SIGNUP_RESET_CPW           = 'SIGNUP_RESET_CPW';
export const SIGNUP_DO_RECAP            = 'SIGNUP_DO_RECAP';
export const SIGNUP_SET_EM_MSG          = 'SIGNUP_SET_EM_MSG';
export const SIGNUP_CLEAR_EM_MSG        = 'SIGNUP_CLEAR_EM_MSG';
export const SIGNUP_SET_DN_MSG          = 'SIGNUP_SET_DN_MSG';
export const SIGNUP_CLEAR_DN_MSG        = 'SIGNUP_CLEAR_DN_MSG';
export const SIGNUP_SET_PW_MSG          = 'SIGNUP_SET_PW_MSG';
export const SIGNUP_CLEAR_PW_MSG        = 'SIGNUP_CLEAR_PW_MSG';
export const SIGNUP_SET_CPW_MSG         = 'SIGNUP_SET_CPW_MSG';
export const SIGNUP_CLEAR_CPW_MSG       = 'SIGNUP_CLEAR_CPW_MSG';
export const SIGNUP_SET_ERR_MSG         = 'SIGNUP_SET_ERR_MSG';
export const SIGNUP_CLEAR_ERR_MSG       = 'SIGNUP_CLEAR_ERR_MSG';
export const SIGNUP_START               = 'SIGNUP_START';
export const SIGNUP_SUCCEED             = 'SIGNUP_SUCCEED';
export const SIGNUP_FAILED              = 'SIGNUP_FAILED';
export const SIGNUP_FETCH_RECAP_START   = 'SIGNUP_FETCH_RECAP_START';
export const SIGNUP_FETCH_RECAP_SUCCEED = 'SIGNUP_FETCH_RECAP_SUCCEED';
export const SIGNUP_FETCH_RECAP_FAILED  = 'SIGNUP_FETCH_RECAP_FAILED';

//reset form
export const RESET_RESET               = 'RESET_RESET';
export const RESET_SET_EM              = 'RESET_SET_EM';
export const RESET_RESET_EM            = 'RESET_RESET_EM';
export const RESET_DO_RECAP            = 'RESET_DO_RECAP';
export const RESET_SET_EM_MSG          = 'RESET_SET_EM_MSG';
export const RESET_CLEAR_EM_MSG        = 'RESET_CLEAR_EM_MSG';
export const RESET_SET_ERR_MSG         = 'RESET_SET_ERR_MSG';
export const RESET_CLEAR_ERR_MSG       = 'RESET_CLEAR_ERR_MSG';
export const RESET_START               = 'RESET_START';
export const RESET_SUCCEED             = 'RESET_SUCCEED';
export const RESET_FAILED              = 'RESET_FAILED';
export const RESET_FETCH_RECAP_START   = 'RESET_FETCH_RECAP_START';
export const RESET_FETCH_RECAP_SUCCEED = 'RESET_FETCH_RECAP_SUCCEED';
export const RESET_FETCH_RECAP_FAILED  = 'RESET_FETCH_RECAP_FAILED';

//plans
export const PLAN_RESET          = 'PLAN_RESET';
export const PLAN_ADD            = 'PLAN_ADD';
export const PLAN_REMOVE         = 'PLAN_REMOVE';
export const PLAN_EDIT           = 'PLAN_EDIT';
export const PLAN_OPEN_CREATE    = 'PLAN_OPEN_CREATE';
export const PLAN_CLOSE_CREATE   = 'PLAN_CLOSE_CREATE';
export const PLAN_SET_NAME       = 'PLAN_SET_NAME';
export const PLAN_SET_START      = 'PLAN_SET_START';
export const PLAN_SET_END        = 'PLAN_SET_END';
export const PLAN_SET_NAME_MSG   = 'PLAN_SET_NAME_MSG';
export const PLAN_SET_START_MSG  = 'PLAN_SET_START_MSG';
export const PLAN_SET_END_MSG    = 'PLAN_SET_END_MSG';
export const PLAN_SET_ERR_MSG    = 'PLAN_SET_ERR_MSG';
export const PLAN_CREATE_START   = 'PLAN_CREATE_START';
export const PLAN_CREATE_SUCCEED = 'PLAN_CREATE_SUCCEED';
export const PLAN_CREATE_FAILED  = 'PLAN_CREATE_FAILED';
export const PLAN_FETCH_START    = 'PLAN_FETCH_START';
export const PLAN_FETCH_SUCCEED  = 'PLAN_FETCH_SUCCEED';
export const PLAN_FETCH_FAILED   = 'PLAN_FETCH_FAILED';

//work
export const WORK_RESET            = 'WORK_RESET';

export const WORK_SET_PLAN_ID      = 'WORK_SET_PLAN_ID';
export const WORK_GET_ITEM_START   = 'WORK_GET_ITEM_START';
export const WORK_GET_ITEM_SUCCEED = 'WORK_GET_ITEM_SUCCEED';
export const WORK_GET_ITEM_FAILED  = 'WORK_GET_ITEM_FAILED';

export const WORK_GET_ROUTELINE_START   = 'WORK_GET_ROUTELINE_START';
export const WORK_GET_ROUTELINE_SUCCEED = 'WORK_GET_ROUTELINE_SUCCEED';
export const WORK_GET_ROUTELINE_FAILED  = 'WORK_GET_ROUTELINE_FAILED';

export const WORK_GET_DIRECTIONINFO_START   = 'WORK_GET_DIRECTIONINFO_START';
export const WORK_GET_DIRECTIONINFO_SUCCEED = 'WORK_GET_DIRECTIONINFO_SUCCEED';
export const WORK_GET_DIRECTIONINFO_FAILED  = 'WORK_GET_DIRECTIONINFO_FAILED';

//map
export const MAP_INIT_FLY_DONE     = 'MAP_INIT_FLY_DONE';
export const MAP_SET_WIDTH         = 'MAP_SET_WIDTH';
export const MAP_SET_HEIGHT        = 'MAP_SET_HEIGHT';
export const MAP_SET_LNG           = 'MAP_SET_LNG';
export const MAP_SET_LAT           = 'MAP_SET_LAT';
export const MAP_SET_ZOOM          = 'MAP_SET_ZOOM';
export const MAP_MOUSE_DOWN        = 'MAP_MOUSE_DOWN';
export const MAP_MOUSE_UP          = 'MAP_MOUSE_UP';
export const MAP_SET_VIEWPORT      = 'MAP_SET_VIEWPORT';
export const MAP_NEW_ROUTE         = 'MAP_NEW_ROUTE';
export const MAP_APPLY_ROUTE       = 'MAP_APPLY_ROUTE';
export const MAP_LOAD              = 'MAP_LOAD';