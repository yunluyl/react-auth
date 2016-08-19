'use strict';
import React from 'react';
import {Link} from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './signup.scss';
import Recaptcha from '../GDB/Recaptcha.jsx';

const SignupForm = (props) =>
{
	return (
		<form className={styles.signupForm} onSubmit={props.handleSubmit}>
            <input
            	type='text'
            	placeholder='Email address'
            	value={props.signup.email}
            	onChange={props.handleEmailChange}
            />
            <div className={styles.emErrorMsg}>
                {props.signup.emMsg}
            </div>
            <br />
            <input
            	type='text'
            	placeholder='Display name'
            	value={props.signup.name}
            	onChange={props.handleNameChange}
            />
            <div className={styles.dnErrorMsg}>
                {props.signup.dnMsg}
            </div>
            <br />
            <input
            	type='password'
            	placeholder='Password'
            	value={props.signup.password}
            	onChange={props.handlePasswordChange}
            />
            <div className={styles.pwErrorMsg}>
                {props.signup.pwMsg}
            </div>
            <br />
            <input
            	type='password'
            	placeholder='Confirm password'
            	value={props.signup.confirm}
            	onChange={props.handleConfirmChange}
            />
            <div className={styles.cpwErrorMsg}>
                {props.signup.cpwMsg}
            </div>
            <Recaptcha
            	dorecaptcha={props.signup.dorecaptcha}
            	handleRecaptchaDone={props.handleRecaptchaDone}
            	handleRecaptchaExpire={props.handleRecaptchaExpire}
            	setWidgetId={props.setWidgetId}
            />
            <div className={styles.errorMsg}>
                {props.signup.errorMsg}
            </div>
            <div className={styles.login}>
                <Link to='/login'>Login</Link>
            </div>
            <input type='submit' value='Submit' />
        </form>
	);
}

SignupForm.propTypes =
{
	signup : React.PropTypes.object.isRequired,
	handleSubmit : React.PropTypes.func.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
	handleNameChange : React.PropTypes.func.isRequired,
	handlePasswordChange : React.PropTypes.func.isRequired,
	handleConfirmChange : React.PropTypes.func.isRequired,
	handleRecaptchaDone : React.PropTypes.func.isRequired,
	handleRecaptchaExpire : React.PropTypes.func.isRequired,
	setWidgetId : React.PropTypes.func.isRequired
}

export default withStyles(styles)(SignupForm);