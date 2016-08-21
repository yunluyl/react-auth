import * as AD from '../redux/actionDefines.jsx';

export function reset()
{
	return {
		type : AD.LOGIN_RESET
	}
}

export function setEmail(text)
{
	return {
		type : AD.LOGIN_SET_EM,
		text
	};
}

export function resetEmail()
{
	return {
		type : AD.LOGIN_RESET_EM
	};
}

export function setPassword(text)
{
	return {
		type : AD.LOGIN_SET_PW,
		text
	};
}

export function resetPassword()
{
	return {
		type : AD.LOGIN_RESET_PW
	};
}

export function doRecap(recap)
{
	return {
		type : AD.LOGIN_DO_RECAP,
		recap
	};
}

export function setEmailMsg(text)
{
	return {
		type : AD.LOGIN_SET_EM_MSG,
		text
	};
}

export function clearEmailMsg()
{
	return {
		type : AD.LOGIN_CLEAR_EM_MSG
	};
}

export function setPasswordMsg(text)
{
	return {
		type : AD.LOGIN_SET_PW_MSG,
		text
	};
}

export function clearPasswordMsg()
{
	return {
		type : AD.LOGIN_CLEAR_PW_MSG
	};
}

export function setErrorMsg(text)
{
	return {
		type : AD.LOGIN_SET_ERR_MSG,
		text
	};
}

export function clearErrorMsg()
{
	return {
		type : AD.LOGIN_CLEAR_ERR_MSG
	};
}

export const checkForm = (submitForm, email, password, dorecaptcha, recaptcha, data) =>
{
	return (dispatch) =>
	{
		dispatch(clearErrorMsg());
		dispatch(resetPassword());
        if (email)
        {
            dispatch(clearEmailMsg());
        }
        else
        {
            submitForm.v = false;
            dispatch(setEmailMsg('Email is empty'));
        }
        if (password)
        {
            dispatch(clearPasswordMsg());
        }
        else
        {
            submitForm.v = false;
            dispatch(setPasswordMsg('Password is empty'));
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
                data.pw = password;
                data['g-recaptcha-response'] = recaptcha;
            }
        }
        else
        {
            data._id = email;
            data.pw = password;
        }
	};
}

export function loginStart()
{
	return {
		type : AD.LOGIN_START
	};
}

export function loginSucceed()
{
	return {
		type : AD.LOGIN_SUCCEED
	};
}

export function loginFailed(data)
{
	return {
		type : AD.LOGIN_FAILED,
		errorMsg : data.msg,
		recap : data.recap
	};
}

export function login(data)
{
	return function(dispatch)
	{
		return AD.apiRequest(
			dispatch,
			'POST',
			'/api/login',
			loginStart,
			loginSucceed,
			loginFailed,
			data
		);
	};
}

export function fetchRecapStart()
{
	return {
		type : AD.LOGIN_FETCH_RECAP_START
	};
}

export function fetchRecapSucceed(data)
{
	return {
		type : AD.LOGIN_FETCH_RECAP_SUCCEED,
		recap : data.recap
	};
}

export function fetchRecapFailed(data)
{
	return {
		type : AD.LOGIN_FETCH_RECAP_FAILED,
		errorMsg : data.msg
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