'use strict';
import React from 'react';
import apiReq from './apiReq';

class Resend extends React.Component
{
	static defaultProps =
	{
		authPath : '/auth'
	};

	state = 
	{
		active : true,
		isGetActive : false,
		isResend : false
	};

	componentDidMount()
	{
		apiReq(
			'GET',
			this.props.authPath + '/isactive',
			undefined,
			this.getActiveStart,
			this.getActiveSuccess,
			this.getActiveFail
		);
	}

	componentWillUnmount()
	{
		this.setState(
		{
			active : true,
			isGetActive : false,
			isResend : false
		});
	}

	getActiveStart = () =>
	{
		this.setState({isGetActive : true});
	};

	getActiveSuccess = (data) =>
	{
		if (data.active)
		{
			this.setState({isGetActive : false});
		}
		else
		{
			this.setState(
			{
				active : false,
				isGetActive : false
			});
		}
	};

	getActiveFail = (err) =>
	{
		this.setState({isGetActive : false});
	};

	resendStart = () =>
	{
		this.setState({isResend : true});
		if (typeof this.props.start !== 'undefined')
		{
		    this.props.start();
		}
	};

	resendSuccess = (data) =>
	{
		this.setState({isResend : false});
	    if (typeof this.props.success !== 'undefined')
        {
            this.props.success(data);
        }
	};

	resendFail = (err) =>
	{
		this.setState({isResend : false});
	    if (typeof this.props.fail !== 'undefined')
        {
            this.props.fail(err);
        }
	};

	handleResendClick = (e) =>
	{
		apiReq(
			'POST',
			this.props.authPath + '/resend',
			undefined,
			this.resendStart,
			this.resendSuccess,
			this.resendFail
		);
	};

	render()
	{
		let resendButton;
		if (this.state.active === false)
		{
			resendButton = (
				<button
					className = {this.props.resendClass?this.props.resendClass.resendBtn:''}
					style = {this.props.resendStyle?this.props.resendStyle.resendBtn:this.props.resendStyle?{}:{}}
					type = 'button'
					onClick = {this.handleResendClick}
				>
					Resend
				</button>
			);
		}
		else
		{
			resendButton = null;
		}
		return (
			<div>
				{resendButton}
			</div>
		);
	}
}

export default Resend;