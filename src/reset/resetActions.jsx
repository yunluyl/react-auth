import * as AD from '../redux/actionDefines.jsx';

export function reset()
{
	return {
		type : AD.RESET_RESET
	};
}

export function setEmail(text)
{
	return {
		type : AD.RESET_SET_EM,
		text
	};
}

export function resetEmail()
{
	return {
		type : AD.RESET_RESET_EM
	};
}

export function doRecap(recap)
{
	return {
		type : AD.RESET_DO_RECAP,
		recap
	};
}

export function setEmailMsg(text)
{
	return {
		type : AD.RESET_SET_EM_MSG,
		text
	};
}

export function clearEmailMsg()
{
	return {
		type : AD.RESET_CLEAR_EM_MSG
	};
}

export function setErrorMsg(text)
{
	return {
		type : AD.RESET_SET_ERR_MSG,
		text
	};
}

export function clearErrorMsg()
{
	return {
		type : AD.RESET_CLEAR_ERR_MSG
	};
}

export function checkForm(submitForm, email, dorecaptcha, recaptcha, data)
{
	return (dispatch) =>
	{
		dispatch(clearErrorMsg());
		if (email)
		{
		    dispatch(clearEmailMsg());
		}
		else
		{
		    submitForm.v = false;
		    dispatch(setEmailMsg('Email is empty'));
		}
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
		        data['g-recaptcha-response'] = recaptcha;
		    }
		}
		else
		{
		    data._id = email;
		}
	};
}

export function resetStart()
{
	return {
		type : AD.RESET_START
	};
}

export function resetSucceed()
{
	return {
		type : AD.RESET_SUCCEED
	};
}

export function resetFailed(data)
{
	return {
		type : AD.RESET_FAILED,
		errorMsg : data.msg,
		recap : data.recap
	};
}

export function forgetPassword(data)
{
	return function(dispatch)
	{
		return AD.apiRequest(
			dispatch,
			'POST',
			'/api/reset',
			resetStart,
			resetSucceed,
			resetFailed,
			data
		);
	};
}

export function fetchRecapStart()
{
	return {
		type : AD.RESET_FETCH_RECAP_START
	};
}

export function fetchRecapSucceed(data)
{
	return {
		type : AD.RESET_FETCH_RECAP_SUCCEED,
		recap : data.recap
	};
}

export function fetchRecapFailed(data)
{
	return {
		type : AD.RESET_FETCH_RECAP_FAILED,
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