'use strict';
import React from 'react';
import LoginContainer from './LoginContainer';

class Auth extends React.Component
{
	static propTypes =
	{
		authConfig : React.PropTypes.object.isRequired
	};

	render()
	{
		return (
			<LoginContainer
				loginConfig = {this.props.authConfig.login}
				authPath = {this.props.authConfig.authPath}
				recaptcha = {this.props.authConfig.recaptcha}
				sitekey = {this.props.authConfig.sitekey}
			/>
		);
	}
}

export default Auth;