'use strict';
import React from 'react';
import Recaptcha from './Recaptcha';

const LoginForm = (props) =>
{
	return (
		<form
			className={props.loginClass?props.loginClass.form:''}
			style={props.loginStyle?props.loginStyle.form:{}} 
			onSubmit={props.handleSubmit}
		>
		    <input
		    	className={props.loginClass?props.loginClass.emailBox:''}
		    	style={props.loginStyle?props.loginStyle.emailBox:{}} 
		    	type='text'
		    	placeholder='Email address'
		    	value={props.login.email}
		    	onChange={props.handleEmailChange}
		    />
		    <div
		    	className={props.loginClass?props.loginClass.emailError:''}
		    	style={props.loginStyle?props.loginStyle.emailError:{}} 
		    >
		        {props.login.emMsg}
		    </div>
		    <br />
		    <input
		    	className={props.loginClass?props.loginClass.passwordBox:''}
		    	style={props.loginStyle?props.loginStyle.passwordBox:{}} 
		    	type='password'
		    	placeholder='Password'
		    	value={props.login.password}
		    	onChange={props.handlePasswordChange}
		    />
		    <div
		    	className={props.loginClass?props.loginClass.passwordError:''}
		    	style={props.loginStyle?props.loginStyle.passwordError:{}}
		    >
		        {props.login.pwMsg}
		    </div>
		    {props.recaptcha?
		    	<Recaptcha
		    		sitekey={props.sitekey}
		    		handleRecaptchaDone={props.handleRecaptchaDone}
		    		handleRecaptchaExpire={props.handleRecaptchaExpire}
		    		setWidgetId={props.setWidgetId}
		    	/>
		    	:
		    	<div id='no-recaptcha'></div>
			}
		    <div
		    	className={props.loginClass?props.loginClass.errorMessage:''}
		    	style={props.loginStyle?props.loginStyle.errorMessage:{}}
		    >
		        {props.login.errorMsg}
		    </div>
		    <input type='submit' value='Submit' />
		</form>
	);
};

LoginForm.propTypes =
{
	login : React.PropTypes.object.isRequired,
	recaptcha : React.PropTypes.bool.isRequired,
	sitekey : React.PropTypes.string.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
    handlePasswordChange : React.PropTypes.func.isRequired,
    handleRecaptchaDone : React.PropTypes.func.isRequired,
    handleRecaptchaExpire : React.PropTypes.func.isRequired,
    handleSubmit : React.PropTypes.func.isRequired,
    setWidgetId : React.PropTypes.func.isRequired
};

export default LoginForm;