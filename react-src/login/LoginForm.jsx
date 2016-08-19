'use strict';
import React from 'react';
import {Link} from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './login.scss';
import Recaptcha from '../GDB/Recaptcha.jsx';

const LoginForm = (props) =>
{
	return (
		<form className={styles.loginForm} onSubmit={props.handleSubmit}>
		    <input
		    	type='text'
		    	placeholder='Email address'
		    	value={props.login.email}
		    	onChange={props.handleEmailChange}
		    />
		    <div className={styles.emErrorMsg}>
		        {props.login.emMsg}
		    </div>
		    <br />
		    <input
		    	type='password'
		    	placeholder='Password'
		    	value={props.login.password}
		    	onChange={props.handlePasswordChange}
		    />
		    <div className={styles.pwErrorMsg}>
		        {props.login.pwMsg}
		    </div>
		    <Recaptcha
		    	dorecaptcha={props.login.dorecaptcha}
		    	handleRecaptchaDone={props.handleRecaptchaDone}
		    	handleRecaptchaExpire={props.handleRecaptchaExpire}
		    	setWidgetId={props.setWidgetId}
		    />
		    <div className={styles.errorMsg}>
		        {props.login.errorMsg}
		    </div>
		    <div className={styles.signup}>
		        <Link to='/signup'>Signup</Link>
		    </div>
		    <div className={styles.reset}>
		        <Link to='/reset'>Forget password</Link>
		    </div>
		    <br />
		    <input type='submit' value='Submit' />
		</form>
	);
};

LoginForm.propTypes =
{
	login : React.PropTypes.object.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
    handlePasswordChange : React.PropTypes.func.isRequired,
    handleRecaptchaDone : React.PropTypes.func.isRequired,
    handleRecaptchaExpire : React.PropTypes.func.isRequired,
    handleSubmit : React.PropTypes.func.isRequired,
    setWidgetId : React.PropTypes.func.isRequired
};

export default withStyles(styles)(LoginForm);