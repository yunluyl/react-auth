'use strict';
const initialState =
{
	planId : '',
	items : [],
	isGettingItem : false,
	initFlyDone : false,
	mapLoaded : false,
	isDragging : false,
	viewport :
	{
		width : 0,
		height : 0,
		lng : 0,
		lat : 0,
		zoom : 0
	},
	isGettingRouteLine : 0,
	routeChanged : false,
	isGettingDirectionInfo : false,
	routeLine : {},
	directionInfo : {}
};

export default (state = initialState, action) =>
{
	switch(action.type)
	{
		case 'WORK_RESET':
			return initialState;
		case 'WORK_SET_PLAN_ID':
			return {...state, planId : action.planId};
		case 'WORK_GET_ITEM_START':
			return  {...state, isGettingItem : true};
		case 'WORK_GET_ITEM_SUCCEED':
			return {...state, isGettingItem : false, items : action.items};
		case 'WORK_GET_ITEM_FAILED':
			return {...state, isGettingItem : false};
		case 'WORK_GET_ROUTELINE_START':
			return {...state, isGettingRouteLine : state.isGettingRouteLine + 1};
		case 'WORK_GET_ROUTELINE_SUCCEED':
			return {
				...state,
				isGettingRouteLine : state.isGettingRouteLine - 1,
				routeChanged : true,
				routeLine :
				{
					...state.routeLine,
					[action.day] : action.data.routes[0].geometry.coordinates
				}
				};
		case 'WORK_GET_ROUTELINE_FAILED':
			return {...state, isGettingRouteLine : state.isGettingRouteLine - 1};
		case 'WORK_GET_DIRECTIONINFO_START':
			return {...state, isGettingDirectionInfo : true};
		case 'WORK_GET_DIRECTIONINFO_SUCCEED':
			return {
				...state,
				isGettingDirectionInfo : false
			};
		case 'WORK_GET_DIRECTIONINFO_FAILED':
			return {...state, isGettingDirectionInfo : false};
		case 'MAP_INIT_FLY_DONE':
			return {...state, initFlyDone : true};
		case 'MAP_MOUSE_DOWN':
			return {...state, isDragging : true};
		case 'MAP_MOUSE_UP':
			return {...state, isDragging : false};
		case 'MAP_SET_WIDTH':
			return {...state, viewport : {...state.viewport, width : action.width}};
		case 'MAP_SET_HEIGHT':
			return {...state, viewport : {...state.viewport, height : action.height}};
		case 'MAP_SET_LNG':
			return {...state, viewport : {...state.viewport, lng : action.lng}};
		case 'MAP_SET_LAT':
			return {...state, viewport : {...state.viewport, lat : action.lat}};
		case 'MAP_SET_ZOOM':
			return {...state, viewport : {...state.viewport, zoom : action.zoom}};
		case 'MAP_SET_VIEWPORT':
			return {...state, viewport : action.viewport};
		case 'MAP_NEW_ROUTE':
			return {...state, routeChanged : true};
		case 'MAP_APPLY_ROUTE':
			return {...state, routeChanged : false};
		case 'MAP_LOAD':
			return {...state, mapLoaded : true};
		default:
			return state;
	}
}