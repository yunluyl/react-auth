'use strict';
const initialState =
{
	planli : {
		plans : [],
		isFetching : false
	},
	newplan : {
		open : false,
		name : '',
		start : '',
		end : '',
		nameMsg : '',
		startMsg : '',
		endMsg : '',
		errorMsg : '',
		isCreatingPlan : false,
	}
}

const planReducer = (state = initialState, action) =>
{
	switch(action.type)
	{
		case 'PLAN_RESET':
			return initialState;
		case 'PLAN_ADD':
			return {...state, plans : [...state.plans, action.newplan]};
		case 'PLAN_REMOVE':
			return {...state, plans : [...state.plans.slice(0, action.index), ...state.plans.slice(action.index + 1)]};
		case 'PLAN_EDIT':
			return {...state, plans : [...state.plans.slice(0, action.index), action.newplan, ...state.plans.slice(action.index + 1)]};
		case 'PLAN_OPEN_CREATE':
			return {...state, newplan : {...state.newplan, open : true}};
		case 'PLAN_CLOSE_CREATE':
			return {...state, newplan : {...state.newplan, open : false}};
		case 'PLAN_SET_NAME':
			return {...state, newplan : {...state.newplan, name : action.text}};
		case 'PLAN_SET_START':
			return {...state, newplan : {...state.newplan, start : action.text}};
		case 'PLAN_SET_END':
			return {...state, newplan : {...state.newplan, end : action.text}};
		case 'PLAN_SET_NAME_MSG':
			return {...state, newplan : {...state.newplan, nameMsg : action.text}};
		case 'PLAN_SET_START_MSG':
			return {...state, newplan : {...state.newplan, startMsg : action.text}};
		case 'PLAN_SET_END_MSG':
			return {...state, newplan : {...state.newplan, endMsg : action.text}};
		case 'PLAN_SET_ERR_MSG':
			return {...state, newplan : {...state.newplan, errorMsg : action.text}};
		case 'PLAN_CREATE_START':
			return {...state, newplan : {...state.newplan, isCreatingPlan : true}};
		case 'PLAN_CREATE_SUCCEED':
			return {
				...state,
				newplan : {
					...state.newplan,
					isCreatingPlan : false,
					name : '',
					start : '',
					end : '',
					open : false
				}
			};
		case 'PLAN_CREATE_FAILED':
			return {
				...state,
				newplan : {
					...state.newplan,
					isCreatingPlan : false,
					errorMsg : action.errorMsg
				}
			};
		case 'PLAN_FETCH_START':
			return {...state, planli : {...state.planli, isFetching : true}};
		case 'PLAN_FETCH_SUCCEED':
			return {...state, planli : {...state.planli, plans : action.plans, isFetching : false}};
		case 'PLAN_FETCH_FAILED':
			return {...state, planli : {...state.planli, isFetching : false}};
		default:
			return state;
	}
}

export default planReducer;

/*
console.log('test');

import deepFreeze from 'deep-freeze';
if (require.main === module)
{
	const action =
	{
		type : 'PLAN_ADD',
		_id : '123',
		newplan : {
			name :  'San Diego',
			start : '2015',
			end : '2016'
		}
	};
	const action2 =
	{
		type : 'PLAN_REMOVE',
		_id : '123'
	};
	deepFreeze(initialState);
	console.log('test start');
	let newState = planReducer(initialState, action);
	console.log(newState);
	deepFreeze(newState);
	console.log(planReducer(newState, action2));
}
*/