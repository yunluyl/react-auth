'use strict';
import React from 'react';
import {render} from 'react-dom';
import Login from '../react-lib/Login';
import Signup from '../react-lib/Signup';

class Auth extends React.Component
{
	state =
	{
		activePanel : 'login' //login, signup, reset
	};

	componentWillMount()
	{
		this.authPath = '/auth';
		this.recaptcha = false;
		this.sitekey = '6LfqHigTAAAAAN3M7N_PRfODACcRtG1WnTnjgbxd';

		this.loginConfig =
		{
			style :
			{
				form :
				{

				},
				emailBox :
				{

				},
				emailError :
				{
					display: 'inline-block'
				},
				passwordBox :
				{

				},
				passwordError :
				{
					display: 'inline-block'
				},
				errorMessage :
				{
					height: '20px',
					backgroundColor: 'red'
				}
			},
			//or classname
		};

		this.signupConfig =
		{
			style :
			{
				form :
				{

				},
				emailBox :
				{

				},
				emailError :
				{
					display: 'inline-block'
				},
				nameBox :
				{

				},
				nameError :
				{
					display: 'inline-block'
				},
				passwordBox :
				{

				},
				passwordError :
				{
					display: 'inline-block'
				},
				confirmBox :
				{

				},
				confirmError :
				{
					display: 'inline-block'
				},
				errorMessage :
				{
					height: '20px',
					backgroundColor: 'red'
				}
			}
		};
	}

	loginStart = () =>
	{

	};

	loginSuccess = (data) =>
	{

	};

	loginFail = (err) =>
	{

	};

	signupStart = () =>
	{

	};

	signupSuccess = (data) =>
	{
		this.setState(
		{
			activePanel : 'login'
		});
	};

	signupFail = (err) =>
	{

	};

	linkToSignup = (e) =>
	{
		this.setState(
		{
			activePanel : 'signup'
		});
	};

	linkToLogin = (e) =>
	{
		this.setState(
		{
			activePanel : 'login'
		});
	};

	render()
	{
		let activePanel;
		switch (this.state.activePanel)
		{
			case 'login':
				activePanel = (
					<Login
						loginConfig = {this.loginConfig}
						authPath = {this.authPath}
						recaptcha = {this.recaptcha}
						sitekey = {this.sitekey}
						success = {this.loginSuccess}
						fail = {this.loginFail}
					/>
				);
				break;
			case 'signup':
				activePanel = (
					<Signup
						signupConfig = {this.signupConfig}
						authPath = {this.authPath}
						recaptcha = {this.recaptcha}
						sitekey = {this.sitekey}
						success = {this.signupSuccess}
						fail = {this.signupFail}
					/>
				);
				break;
			case 'reset':
				break;
			default:
				activePanel = null;
		}
		return (
			<div>
				{activePanel}
				<input type='button' onClick={this.linkToSignup} value='Signup' />
				<input type='button' onClick={this.linkToLogin} value='Login' />
			</div>
		);
	}
}

render(
	<Auth />,
	document.getElementById('root')
);