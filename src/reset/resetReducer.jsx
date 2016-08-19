'use strict';
const initialState =
{
	email : '',
    dorecaptcha : false,
    emMsg : '',
    errorMsg : '',
    isReset : false,
	isFetching : false
};

export default function(state = initialState, action)
{
	switch(action.type)
	{
		case 'RESET_RESET':
			return {...initialState, email : state.email};
		case 'RESET_SET_EM':
		case 'LOGIN_SET_EM':
		case 'SIGNUP_SET_EM':
			return {...state, email : action.text};
		case 'RESET_RESET_EM':
			return {...state, email : ''};
		case 'RESET_DO_RECAP':
			return {...state, dorecaptcha : action.recap};
		case 'RESET_SET_EM_MSG':
			return {...state, emMsg : action.text};
		case 'RESET_CLEAR_EM_MSG':
			return {...state, emMsg : ''};
		case 'RESET_SET_ERR_MSG':
			return {...state, errorMsg : action.text};
		case 'RESET_CLEAR_ERR_MSG':
			return {...state, errorMsg : ''};
		case 'RESET_START':
			return {...state, isReset : true};
		case 'RESET_SUCCEED':
			return {...state, isReset : false};
		case 'RESET_FAILED':
			return {...state, isReset : false, errorMsg : action.errorMsg, dorecaptcha : action.recap};
		case 'RESET_FETCH_RECAP_START':
			return {...state, isFetching : true};
		case 'RESET_FETCH_RECAP_SUCCEED':
			return {...state, isFetching : false, dorecaptcha : action.recap};
		case 'RESET_FETCH_RECAP_FAILED':
			return {...state, isFetching : false, errorMsg : action.errorMsg, dorecaptcha : true};
		default:
			return state;
	}
}