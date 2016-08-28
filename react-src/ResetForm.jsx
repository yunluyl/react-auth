'use strict';
import React from 'react';
import Recaptcha from './Recaptcha';

const ResetForm = (props) =>
{
	return (
		<form
            className={props.resetClass?props.resetClass.form:''}
            style={props.resetStyle?props.resetStyle.form:{}}
            onSubmit={props.handleSubmit}
        >
            <input
                className={props.resetClass?props.resetClass.emailBox:''}
                style={props.resetStyle?props.resetStyle.emailBox:{}}
            	type='text'
            	placeholder='Email address'
            	value={props.reset.email}
            	onChange={props.handleEmailChange}
            />
            <div
                className={props.resetClass?props.resetClass.emailError:''}
                style={props.resetStyle?props.resetStyle.emailError:{}}
            >
                {props.reset.emMsg}
            </div>
            <br />
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
                className={props.resetClass?props.resetClass.errorMessage:''}
                style={props.resetStyle?props.resetStyle.errorMessage:{}}
            >
                {props.reset.errorMsg}
            </div>
            <input type='submit' value='Submit' />
        </form>
	);
}

ResetForm.propTypes =
{
	reset : React.PropTypes.object.isRequired,
    recaptcha : React.PropTypes.bool.isRequired,
    sitekey : React.PropTypes.string.isRequired,
	handleSubmit : React.PropTypes.func.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
	handleRecaptchaDone : React.PropTypes.func.isRequired,
	handleRecaptchaExpire : React.PropTypes.func.isRequired,
	setWidgetId : React.PropTypes.func.isRequired
}

export default ResetForm;