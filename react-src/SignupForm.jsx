'use strict';
import React from 'react';
import Recaptcha from './Recaptcha.js';

const SignupForm = (props) =>
{
	return (
		<form
            className={props.signupClass?props.signupClass.form:''}
            style={props.signupStyle?props.signupStyle.form:{}} 
            onSubmit={props.handleSubmit}
        >
            <input
                className={props.signupClass?props.signupClass.emailBox:''}
                style={props.signupStyle?props.signupStyle.emailBox:{}} 
            	type='text'
            	placeholder='Email address'
            	value={props.signup.email}
            	onChange={props.handleEmailChange}
            />
            <div
                className={props.signupClass?props.signupClass.emailError:''}
                style={props.signupStyle?props.signupStyle.emailError:{}} 
            >
                {props.signup.emMsg}
            </div>
            <br />
            <input
                className={props.signupClass?props.signupClass.nameBox:''}
                style={props.signupStyle?props.signupStyle.nameBox:{}} 
            	type='text'
            	placeholder='Display name'
            	value={props.signup.name}
            	onChange={props.handleNameChange}
            />
            <div
                className={props.signupClass?props.signupClass.nameError:''}
                style={props.signupStyle?props.signupStyle.nameError:{}} 
            >
                {props.signup.dnMsg}
            </div>
            <br />
            <input
                className={props.signupClass?props.signupClass.passwordBox:''}
                style={props.signupStyle?props.signupStyle.passwordBox:{}} 
            	type='password'
            	placeholder='Password'
            	value={props.signup.password}
            	onChange={props.handlePasswordChange}
            />
            <div
                className={props.signupClass?props.signupClass.passwordError:''}
                style={props.signupStyle?props.signupStyle.passwordError:{}} 
            >
                {props.signup.pwMsg}
            </div>
            <br />
            <input
                className={props.signupClass?props.signupClass.confirmBox:''}
                style={props.signupStyle?props.signupStyle.confirmBox:{}} 
            	type='password'
            	placeholder='Confirm password'
            	value={props.signup.confirm}
            	onChange={props.handleConfirmChange}
            />
            <div
                className={props.signupClass?props.signupClass.confirmError:''}
                style={props.signupStyle?props.signupStyle.confirmError:{}}
            >
                {props.signup.cpwMsg}
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
                className={props.signupClass?props.signupClass.errorMessage:''}
                style={props.signupStyle?props.signupStyle.errorMessage:{}}
            >
                {props.signup.errorMsg}
            </div>
            <input type='submit' value='Submit' />
        </form>
	);
}

SignupForm.propTypes =
{
	signup : React.PropTypes.object.isRequired,
    recaptcha : React.PropTypes.bool.isRequired,
    sitekey : React.PropTypes.string.isRequired,
	handleSubmit : React.PropTypes.func.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
	handleNameChange : React.PropTypes.func.isRequired,
	handlePasswordChange : React.PropTypes.func.isRequired,
	handleConfirmChange : React.PropTypes.func.isRequired,
	handleRecaptchaDone : React.PropTypes.func.isRequired,
	handleRecaptchaExpire : React.PropTypes.func.isRequired,
	setWidgetId : React.PropTypes.func.isRequired
}

export default SignupForm;