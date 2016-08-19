'use strict';
const initialState =
{
	email : '',
    name : '',
    password : '',
    confirm : '',
    dorecaptcha : false,
    emMsg : '',
    dnMsg : '',
    pwMsg : '',
    cpwMsg : '',
    errorMsg : '',
    isSignup : false,
	isFetching : false
}

export default function(state = initialState, action)
{
	switch(action.type)
	{
		case 'SIGNUP_RESET':
			return {...initialState, email : state.email};
		case 'SIGNUP_SET_EM':
		case 'LOGIN_SET_EM':
		case 'RESET_SET_EM':
			return {...state, email : action.text};
		case 'SIGNUP_RESET_EM':
			return {...state, email : ''};
		case 'SIGNUP_SET_DN':
			return {...state, name : action.text};
		case 'SIGNUP_RESET_DN':
			return {...state, name : ''};
		case 'SIGNUP_SET_PW':
			return {...state, password : action.text};
		case 'SIGNUP_RESET_PW':
			return {...state, password : ''};
		case 'SIGNUP_SET_CPW':
			return {...state, confirm : action.text};
		case 'SIGNUP_RESET_CPW':
			return {...state, confirm : ''};
		case 'SIGNUP_DO_RECAP':
			return {...state, dorecaptcha : action.recap};
		case 'SIGNUP_SET_EM_MSG':
			return {...state, emMsg : action.text};
		case 'SIGNUP_CLEAR_EM_MSG':
			return {...state, emMsg : ''};
		case 'SIGNUP_SET_DN_MSG':
			return {...state, dnMsg : action.text};
		case 'SIGNUP_CLEAR_DN_MSG':
			return {...state, dnMsg : ''};
		case 'SIGNUP_SET_PW_MSG':
			return {...state, pwMsg : action.text};
		case 'SIGNUP_CLEAR_PW_MSG':
			return {...state, pwMsg : ''};
		case 'SIGNUP_SET_CPW_MSG':
			return {...state, cpwMsg : action.text};
		case 'SIGNUP_CLEAR_CPW_MSG':
			return {...state, cpwMsg : ''};
		case 'SIGNUP_SET_ERR_MSG':
			return {...state, errorMsg : action.text};
		case 'SIGNUP_CLEAR_ERR_MSG':
			return {...state, errorMsg : ''};
		case 'SIGNUP_START':
			return {...state, isSignup : true};
		case 'SIGNUP_SUCCEED':
			return {...state, isSignup : false};
		case 'SIGNUP_FAILED':
			return {...state, isSignup : false, errorMsg : action.errorMsg, dorecaptcha : action.recap};
		case 'SIGNUP_FETCH_RECAP_START':
			return {...state, isFetching : true};
		case 'SIGNUP_FETCH_RECAP_SUCCEED':
			return {...state, isFetching : false, dorecaptcha : action.recap};
		case 'SIGNUP_FETCH_RECAP_FAILED':
			return {...state, isFetching : false, errorMsg : action.errorMsg, dorecaptcha : true};
		default:
			return state;
	}
}