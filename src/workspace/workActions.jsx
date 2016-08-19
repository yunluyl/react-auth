import * as AD from '../redux/actionDefines.jsx';

//work
export const reset = () =>
{
	return {
		type : AD.WORK_RESET
	};
}

export const setPlanId = (planId) =>
{
	return {
		type : AD.WORK_SET_PLAN_ID,
		planId
	};
}

export const getItemStart = () =>
{
	return {
		type : AD.WORK_GET_ITEM_START
	};
}

export const getItemSucceed = (data) =>
{
	return {
		type : AD.WORK_GET_ITEM_SUCCEED,
		items : data.items
	};
}

export const getItemFailed = () =>
{
	return {
		type : AD.WORK_GET_ITEM_FAILED
	};
}

export const getItem = (data, cookie) =>
{
	return (dispatch) =>
	{
		return AD.apiRequest(
			dispatch,
			'POST',
			'/api/getit',
			getItemStart,
			getItemSucceed,
			getItemFailed,
			data,
			cookie
		);
	};
}

//get directions

export const getRouteLineStart = () =>
{
	return {
		type : AD.WORK_GET_ROUTELINE_START
	};
}

export const getRouteLineSucceed = (data, day) =>
{
	return {
		type : AD.WORK_GET_ROUTELINE_SUCCEED,
		data,
		day
	};
}

export const getRouteLineFailed = (day) =>
{
	return {
		type : AD.WORK_GET_ROUTELINE_FAILED,
		day
	};
}

export const getDirectionInfoStart = () =>
{
	return {
		type : AD.WORK_GET_DIRECTIONINFO_START
	};
}

export const getDirectionInfoSucceed = (data, day, index) =>
{
	return {
		type : AD.WORK_GET_ROUTELINE_SUCCEED,
		data,
		day,
		index
	};
}

export const getDirectionInfoFailed = () =>
{
	return {
		type : AD.WORK_GET_ROUTELINE_FAILED
	};
}

export const getRoute = (waypoints, mode, overview, day, index) =>
{
	return (dispatch) =>
	{
		let coordinates = '';
		for (let i = 0; i < waypoints.length; i++)
		{
			if (i === waypoints.length - 1)
			{
				coordinates += waypoints[i][0] + ',' + waypoints[i][1];
			}
			else
			{
				coordinates += waypoints[i][0] + ',' + waypoints[i][1] + ';';
			}
		}
		if (index)
		{
			dispatch(getDirectionInfoStart());
		}
		else
		{
			dispatch(getRouteLineStart());
		}
		fetch('https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coordinates
			+ '?geometries=geojson&overview=' + overview
			+ '&access_token=pk.eyJ1IjoibHV5dW4xOTg5OTMiLCJhIjoiY2lwanczdmVnMDF6NHRlbTQ0dHdkemJ3ZCJ9.jmWyDcYef7dh8fxuXP3nZg',
			{
			    method : 'GET',
			    cache : 'no-cache',
			    headers :
			    {
			        'Content-Type' : 'application/json'
			    }
			})
		.then((response) =>
		{
			if (response.status === 200)
			{
		    	if (response.headers.get('Content-Type') === 'application/json; charset=utf-8')
		    	{
		    		return response.json().then((json) =>
		    		{
		    			if (index)
		    			{
		    				dispatch(getDirectionInfoSucceed(json, day, index));
		    			}
		    			else
		    			{
		    				dispatch(getRouteLineSucceed(json, day));
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
		    		if (index)
		    		{
		    			dispatch(getDirectionInfoFailed());
		    		}
		    		else
		    		{
		    			dispatch(getRouteLineFailed(day));
		    		}
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
			data = {msg : err.message, recap : true};
			if (index)
			{
				dispatch(getDirectionInfoFailed());
			}
			else
			{
				dispatch(getRouteLineFailed(day));
			}
		    console.log(err);
		});
	};
}

export const getAllRouteLines = (items) =>
{
	return (dispatch) =>
	{
		let waypoints = {};
		for (let i = 0; i < items.length; i++)
		{
			if (items[i].day === 0)
			{
				continue;
			}
			else
			{
				if (waypoints.hasOwnProperty(items[i].day))
				{
					waypoints[items[i].day].push(items[i].loc);
				}
				else
				{
					waypoints[items[i].day] = [items[i].loc];
				}
			}
		}
		for (let key in waypoints)
		{
			if (waypoints.hasOwnProperty(key))
			{
				const lastDay = (Number(key) - 1).toString();
				if (waypoints.hasOwnProperty(lastDay))
				{
					waypoints[key].unshift(waypoints[lastDay][waypoints[lastDay].length - 1]);
				}
				if (waypoints[key].length > 1)
				{
					dispatch(getRoute(waypoints[key], 'driving', 'full', key));
				}
			}
		}
	};
}

//map
export const initFlyDone = () =>
{
	return {
		type : AD.MAP_INIT_FLY_DONE
	};
}

export const mouseDown = () =>
{
	return {
		type : AD.MAP_MOUSE_DOWN
	};
}

export const mouseUp = () =>
{
	return {
		type : AD.MAP_MOUSE_UP
	};
}

export const setWidth = (width) =>
{
	return {
		type : AD.MAP_SET_WIDTH,
		width
	};
}

export const setHeight = (height) =>
{
	return {
		type : AD.MAP_SET_HEIGHT,
		height
	};
}

export const setLng = (lng) =>
{
	return {
		type : AD.MAP_SET_LNG,
		lng
	};
}

export const setLat = (lat) =>
{
	return {
		type : AD.MAP_SET_LAT,
		lat
	};
}

export const setZoom = (zoom) =>
{
	return {
		type : AD.MAP_SET_ZOOM,
		zoom
	};
}

export const setViewport = (viewport) =>
{
	return {
		type : AD.MAP_SET_VIEWPORT,
		viewport
	};
}

export const newRoute = () =>
{
	return {
		type : AD.MAP_NEW_ROUTE
	};
}

export const applyRoute = () =>
{
	return {
		type : AD.MAP_APPLY_ROUTE
	};
}

export const mapLoad = () =>
{
	return {
		type : AD.MAP_LOAD
	};
}