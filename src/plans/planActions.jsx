import * as AD from '../redux/actionDefines.jsx';
import {browserHistory} from 'react-router';

export const reset = () =>
{
	return {
		type : AD.PLAN_RESET
	};
}

export const add = (newplan) =>
{
	return {
		type : AD.PLAN_ADD,
		newplan
	};
}

export const remove = (index) =>
{
	return {
		type : AD.PLAN_REMOVE,
		index
	};
}

export const edit = (index, newplan) =>
{
	return {
		type : AD.PLAN_EDIT,
		index,
		newplan
	};
}

export const openCreate = () =>
{
	return {
		type : AD.PLAN_OPEN_CREATE
	};
}

export const closeCreate = () =>
{
	return {
		type : AD.PLAN_CLOSE_CREATE
	};
}

export const setName = (text) =>
{
	return {
		type : AD.PLAN_SET_NAME,
		text
	};
}

export const setStart = (text) =>
{
	return {
		type : AD.PLAN_SET_START,
		text
	};
}

export const setEnd = (text) =>
{
	return {
		type : AD.PLAN_SET_END,
		text
	};
}

export const setNameMsg = (text) =>
{
	return {
		type : AD.PLAN_SET_NAME_MSG,
		text
	};
}

export const setStartMsg = (text) =>
{
	return {
		type : AD.PLAN_SET_START_MSG,
		text
	};
}

export const setEndMsg = (text) =>
{
	return {
		type : AD.PLAN_SET_END_MSG,
		text
	};
}

export const setErrorMsg = (text) =>
{
	return {
		type : AD.PLAN_SET_ERR_MSG,
		text
	};
}

export const createPlanStart = () =>
{
	return {
		type : AD.PLAN_CREATE_START
	};
}

export const createPlanSucceed = () =>
{
	return {
		type : AD.PLAN_CREATE_SUCCEED
	};
}

export const createPlanFailed = (data) =>
{
	return {
		type : AD.PLAN_CREATE_FAILED,
		errorMsg : data.msg
	};
}

export const fetchPlanStart = () =>
{
	return {
		type : AD.PLAN_FETCH_START
	};
}

export const fetchPlanSucceed = (data) =>
{
	return {
		type : AD.PLAN_FETCH_SUCCEED,
		plans : data.plans
	};
}

export const fetchPlanFailed = () =>
{
	return {
		type : AD.PLAN_FETCH_FAILED
	};
}

//combined actions
export const checkForm = (submitForm, name, start, end) =>
{
	return (dispatch) =>
	{
		dispatch(setErrorMsg(''));
		if (name)
		{
			dispatch(setNameMsg(''));
		}
		else
		{
			submitForm.v = false;
			dispatch(setNameMsg('Name is empty'));
		}
		if (start)
		{
			dispatch(setStartMsg(''));
		}
		else
		{
			submitForm.v = false;
			dispatch(setStartMsg('Start date is empty'));
		}
		if (end)
		{
			dispatch(setEndMsg(''));
		}
		else
		{
			submitForm.v = false;
			dispatch(setEndMsg('End date is empty'));
		}
	};
}

export const createPlan = (data) =>
{
	return (dispatch) =>
	{
		return AD.apiRequest(
			dispatch,
			'POST',
			'/api/createplan',
			createPlanStart,
			createPlanSucceed,
			createPlanFailed,
			data
		);
	};
}

export const getPlan = (cookie) =>
{
	return (dispatch) =>
	{
		return AD.apiRequest(
			dispatch,
			'GET',
			'/api/getplan',
			fetchPlanStart,
			fetchPlanSucceed,
			fetchPlanFailed,
			undefined,
			cookie
		);
	};
}