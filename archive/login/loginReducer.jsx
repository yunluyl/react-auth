'use strict';
const initalState =
{
	email : '',
	password : '',
	dorecaptcha : false,
	emMsg : '',
	pwMsg : '',
	errorMsg : '',
	isLogin : false,
	isFetching : false
};
	
export default function(state = initalState, action)
{
	switch (action.type)
	{
		case 'LOGIN_RESET':
			return {...initalState, email : state.email};
		case 'LOGIN_SET_EM':
		case 'SIGNUP_SET_EM':
		case 'RESET_SET_EM':
			return {...state, email : action.text};
		case 'LOGIN_RESET_EM':
			return {...state, email : ''};
		case 'LOGIN_SET_PW':
			return {...state, password : action.text};
		case 'LOGIN_RESET_PW':
			return {...state, password : ''};
		case 'LOGIN_DO_RECAP':
			return {...state, dorecaptcha : action.recap};
		case 'LOGIN_SET_EM_MSG':
			return {...state, emMsg : action.text};
		case 'LOGIN_CLEAR_EM_MSG':
			return {...state, emMsg : ''};
		case 'LOGIN_SET_PW_MSG':
			return {...state, pwMsg : action.text};
		case 'LOGIN_CLEAR_PW_MSG':
			return {...state, pwMsg : ''};
		case 'LOGIN_SET_ERR_MSG':
			return {...state, errorMsg : action.text};
		case 'LOGIN_CLEAR_ERR_MSG':
			return {...state, errorMsg : ''};
		case 'LOGIN_START':
			return {...state, isLogin : true};
		case 'LOGIN_SUCCEED':
			return {...state, isLogin : false};
		case 'LOGIN_FAILED':
			return {...state, isLogin : false, errorMsg : action.errorMsg, dorecaptcha : action.recap};
		case 'LOGIN_FETCH_RECAP_START':
			return {...state, isFetching : true};
		case 'LOGIN_FETCH_RECAP_SUCCEED':
			return {...state, isFetching : false, dorecaptcha : action.recap};
		case 'LOGIN_FETCH_RECAP_FAILED':
			return {...state, isFetching : false, errorMsg : action.errorMsg, dorecaptcha : true};
		case 'SIGNUP_SUCCEED':
			if (action.redirect === '/login')
			{
				return {...state, errorMsg : action.msg};
			}
			else
			{
				return state
			}
		default:
			return state;
	}
}