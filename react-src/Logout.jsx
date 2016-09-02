'use strict';
import React from 'react';
import apiReq from './apiReq';

class Logout extends React.Component
{
	static defaultProps =
	{
		authPath : '/auth'
	};

	state = 
	{
		isLogout : false
	};

	componentWillUnmount()
	{
		this.setState({isLogout : false});
	}

	logoutStart = () =>
	{
		this.setState({isLogout : true});
		if (typeof this.props.start !== 'undefined')
		{
		    this.props.start();
		}
	};

	logoutSuccess = (data) =>
	{
		this.setState({isLogout : false});
	    if (typeof this.props.success !== 'undefined')
        {
            this.props.success(data);
        }
	};

	logoutFail = (err) =>
	{
		this.setState({isLogout : false});
	    if (typeof this.props.fail !== 'undefined')
        {
            this.props.fail(err);
        }
	};

	handleLogoutClick = (e) =>
	{
		apiReq(
			'POST',
			this.props.authPath + '/logout',
			undefined,
			this.logoutStart,
			this.logoutSuccess,
			this.logoutFail
		);
	};

	render()
	{
		return (
			<button
				className = {this.props.logoutClass?this.props.logoutClass.logoutBtn:''}
				style = {this.props.logoutStyle?this.props.logoutStyle.logoutBtn:this.props.logoutClass?{}:{}}
				type = 'button'
				onClick = {this.handleLogoutClick}
			>
				Logout
			</button>
		);
	}
}

export default Logout;