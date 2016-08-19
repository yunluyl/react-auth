import fetch from 'isomorphic-fetch';
import * as AD from '../redux/actionDefines.jsx';

export function reset()
{
	return {
		type : AD.SIGNUP_RESET
	};
}

export function setEmail(text)
{
	return {
		type : AD.SIGNUP_SET_EM,
		text
	};
}

export function resetEmail()
{
	return {
		type : AD.SIGNUP_RESET_EM
	};
}

export function setName(text)
{
	return {
		type : AD.SIGNUP_SET_DN,
		text
	};
}

export function resetName()
{
	return {
		type : AD.SIGNUP_RESET_DN
	};
}

export function setPassword(text)
{
	return {
		type : AD.SIGNUP_SET_PW,
		text
	};
}

export function resetPassword()
{
	return {
		type : AD.SIGNUP_RESET_PW
	};
}

export function setConfirm(text)
{
	return {
		type : AD.SIGNUP_SET_CPW,
		text
	};
}

export function resetConfirm()
{
	return {
		type : AD.SIGNUP_RESET_CPW
	};
}

export function doRecap(recap)
{
	return {
		type : AD.SIGNUP_DO_RECAP,
		recap
	};
}

export function setEmailMsg(text)
{
	return {
		type : AD.SIGNUP_SET_EM_MSG,
		text
	};
}

export function clearEmailMsg()
{
	return {
		type : AD.SIGNUP_CLEAR_EM_MSG
	};
}

export function setNameMsg(text)
{
	return {
		type : AD.SIGNUP_SET_DN_MSG,
		text
	};
}

export function clearNameMsg()
{
	return {
		type : AD.SIGNUP_CLEAR_DN_MSG
	};
}

export function setPasswordMsg(text)
{
	return {
		type : AD.SIGNUP_SET_PW_MSG,
		text
	};
}

export function clearPasswordMsg()
{
	return {
		type : AD.SIGNUP_CLEAR_PW_MSG
	};
}

export function setConfirmMsg(text)
{
	return {
		type : AD.SIGNUP_SET_CPW_MSG,
		text
	};
}

export function clearConfirmMsg()
{
	return {
		type : AD.SIGNUP_CLEAR_CPW_MSG
	};
}

export function setErrorMsg(text)
{
	return {
		type : AD.SIGNUP_SET_ERR_MSG,
		text
	};
}

export function clearErrorMsg()
{
	return {
		type : AD.SIGNUP_CLEAR_ERR_MSG
	};
}

export const checkForm = (submitForm, email, name, password, confirm, dorecaptcha, recaptcha, data) =>
{
	return (dispatch) =>
	{
		dispatch(clearErrorMsg());
		dispatch(resetPassword());
		dispatch(resetConfirm());
		//Check email is correct
		if (email.match(/^.{1,50}[@].{1,50}[.].{1,50}$/))
		{
		    dispatch(clearEmailMsg());
		}
		else if (email)
		{
		    submitForm.v = false;
		    dispatch(setEmailMsg('Email address is not in correct format xxx@xxx.xxx'));
		}
		else
		{
		    submitForm.v = false;
		    dispatch(setEmailMsg('Email is empty'));
		}
		//Check display name is correct
		if (name)
		{
		    dispatch(clearNameMsg());
		}
		else
		{
		    submitForm.v = false;
		    dispatch(setNameMsg('Display name is empty'));
		}
		//Check password is correct
		if (password.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/))
		{
		    dispatch(clearPasswordMsg());
		}
		else if (password)
		{
		    submitForm.v = false;
		    dispatch(setPasswordMsg('Password needs to be 8-20 characters, and contains only numbers, letters, and special characters'))
		}
		else
		{
		    submitForm.v = false;
		    dispatch(setPasswordMsg('Password is empty'));
		}
		//Check confirm password is correct
		if (password !== confirm)
		{
		    submitForm.v = false;
		    dispatch(setConfirmMsg('Password and confirm password are not equal'));
		}
		else if (!confirm)
		{
		    submitForm.v = false;
		    dispatch(setConfirmMsg('Confirm password is empty'));
		}
		else
		{
		    dispatch(clearConfirmMsg());
		}
		//Check recaptcha is correct
		if (dorecaptcha)
		{
		    if (recaptcha === 'EXP')
		    {
		        submitForm.v = false;
		        dispatch(setErrorMsg('Recaptcha expired, please check a new recaptcha'));
		    }
		    else if (recaptcha)
		    {
		        dispatch(clearErrorMsg());
		    }
		    else
		    {
		        submitForm.v = false;
		        dispatch(setErrorMsg('Recaptcha is not checked'));
		    }
		    if (submitForm.v)
		    {
		        data._id = email;
		        data.dn = name;
		        data.pw = password;
		        data['g-recaptcha-response'] = recaptcha;
		    }
		}
		else
		{
		    data._id = email;
		    data.dn = name;
		    data.pw = password;
		}
	};
}

export function signupStart()
{
	return {
		type : AD.SIGNUP_START
	};
}

export function signupSucceed(data)
{
	if (data.hasOwnProperty('msg'))
	{
		return {
			type : AD.SIGNUP_SUCCEED,
			redirect : data.redirect,
			msg : data.msg
		};
	}
	else
	{
		return {
			type : AD.SIGNUP_SUCCEED,
			redirect : data.redirect,
			msg : ''
		};
	}
}

export function signupFailed(data)
{
	return {
		type : AD.SIGNUP_FAILED,
		errorMsg : data.msg,
		recap : data.recap
	};
}

export function signup(data)
{
	return function(dispatch)
	{
		return AD.apiRequest(
			dispatch,
			'POST',
			'/api/signup',
			signupStart,
			signupSucceed,
			signupFailed,
			data
		);
	};
}

export function fetchRecapStart()
{
	return {
		type : AD.SIGNUP_FETCH_RECAP_START
	};
}

export function fetchRecapSucceed(data)
{
	return {
		type : AD.SIGNUP_FETCH_RECAP_SUCCEED,
		recap : data.recap
	};
}

export function fetchRecapFailed(data)
{
	return {
		type : AD.SIGNUP_FETCH_RECAP_FAILED,
		message : data.msg
	};
}

export function fetchRecap()
{
	return function(dispatch)
	{
		return AD.apiRequest(
			dispatch,
			'GET',
			'/api/recaptcha',
			fetchRecapStart,
			fetchRecapSucceed,
			fetchRecapFailed
		);
	};
}