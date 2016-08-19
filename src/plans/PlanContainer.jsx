'use strict';
import React from 'react';
import {connect} from 'react-redux';
import * as action from './planActions.jsx';
import {setPlanId} from '../workspace/workActions.jsx';
import PlanList from './PlanList.jsx';
import NewPlan from './NewPlan.jsx';
import {mountData} from '../redux/actionDefines.jsx';

import {browserHistory} from 'react-router';

class PlanContainer extends React.Component
{
	static fetchData(data, cookie)
	{
		return action.getPlan(cookie);
	}

	componentWillMount()
	{
		this.counter = 0;
	}

	componentWillUnmount()
    {
        this.props.dispatch(action.reset());
    }

	componentDidMount()
	{
		mountData(this.props.dispatch, this.props.serverRender, action.getPlan);
	}
	//plan list
	handlePlanClick = (index) =>
	{
		this.props.dispatch(setPlanId(this.props.planli.plans[index]._id));
		browserHistory.push('/plans/:'+this.props.planli.plans[index]._id);
	};
	handleOpenCreatePlan = (e) =>
	{
		this.props.dispatch(action.openCreate());
	};
	handleRemovePlan = (index) =>
	{
		console.log(index);
	};

	//new plan
	handleNameChange = (e) =>
	{
		this.props.dispatch(action.setName(e.target.value));
	};

	handleStartChange = (e) =>
	{
		this.props.dispatch(action.setStart(e.target.value));
	};

	handleEndChange = (e) =>
	{
		this.props.dispatch(action.setEnd(e.target.value));
	};

	handleNewplanSubmit = (e) =>
	{
		e.preventDefault()
		const dispatch = this.props.dispatch;
		let name = this.props.newplan.name.trim();
        let start = this.props.newplan.start.trim();
        let end = this.props.newplan.end.trim();
        let submitForm = {v : true};
        dispatch(action.checkForm(submitForm, name, start, end));
        if (submitForm.v)
        {
        	dispatch(action.createPlan(
        	{
        		name : name,
        		start : start,
        		end : end
        	}));
        }
	};

	render()
	{
		return (
			<div>
				<PlanList
					planli={this.props.planli}
					handlePlanClick={this.handlePlanClick}
					handleOpenCreatePlan={this.handleOpenCreatePlan}
					handleRemovePlan={this.handleRemovePlan}
				/>
				<NewPlan
					newplan={this.props.newplan}
					handleNewplanSubmit={this.handleNewplanSubmit}
					handleNameChange={this.handleNameChange}
					handleStartChange={this.handleStartChange}
					handleEndChange={this.handleEndChange}
				/>
			</div>
		);
	}
}

const mapState = (state) =>
{
	return {
		serverRender : state.serverReducer.serverRender,
		planli : state.planReducer.planli,
		newplan : state.planReducer.newplan
	};
}

export default connect(mapState)(PlanContainer);