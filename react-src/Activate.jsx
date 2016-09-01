'use strict';
import React from 'react';
import apiReq from './apiReq';

class Activate extends React.Component
{
	static defaultProps =
	{
		authPath : '/auth'
	};

	state =
	{
		message : '',
		isActivate : false
	};

	componentDidMount()
	{
		const query = window.location.search.substring(1);
		const vars = query.split('&');
		let data = {};
		for (let i = 0; i < vars.length; i++)
		{
			const pair = vars[i].split('=');
			if (pair[0] === '_id')
			{
				this._id = pair[1];
				data._id = pair[1];
			}
			else if (pair[0] == 'tk')
			{
				data.tk = pair[1];
			}
		}
		apiReq(
			'POST',
			this.props.authPath + '/activate',
			data,
			this.activateStart,
			this.activateSuccess,
			this.activateFail
		);
	}

	componentWillUnmount()
	{
		this.setState(
		{
			message : '',
			isActivate : false
		});
	}

	activateStart = () =>
	{
		this.setState({isActivate : true});
		if (typeof this.props.start !== 'undefined')
		{
		    this.props.start();
		}
	};

	activateSuccess = (data) =>
	{
		this.setState({message : 'User ' + this._id + ' has been activated', isActivate : false});
	    if (typeof this.props.success !== 'undefined')
        {
            this.props.success(data);
        }
	};

	activateFail = (err) =>
	{
		this.setState({message : err.msg, isActivate : false});
	    if (typeof this.props.fail !== 'undefined')
        {
            this.props.fail(err);
        }
	};

	render()
	{
		return (
			<div
				className = {this.props.activateClass?this.props.activateClass.messageBox:''}
				style = {this.props.activateStyle?this.props.activateStyle.messageBox:this.props.activateClass?{}:{}}
			>
				{this.state.message}
			</div>
		);
	}
}

export default Activate;