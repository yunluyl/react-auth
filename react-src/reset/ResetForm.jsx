'use strict'
import React from 'react';
import {Link} from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './reset.scss';
import Recaptcha from '../GDB/Recaptcha.jsx';

const ResetForm = (props) =>
{
	return (
		<form className={styles.resetForm} onSubmit={props.handleSubmit}>
            <input
            	type='text'
            	placeholder='Email address'
            	value={props.reset.email}
            	onChange={props.handleEmailChange}
            />
            <div className={styles.emErrorMsg}>
                {props.reset.emMsg}
            </div>
            <br />
            <Recaptcha
            	dorecaptcha={props.reset.dorecaptcha}
            	handleRecaptchaDone={props.handleRecaptchaDone}
            	handleRecaptchaExpire={props.handleRecaptchaExpire}
            	setWidgetId={props.setWidgetId}
            />
            <div className={styles.errorMsg}>
                {props.reset.errorMsg}
            </div>
            <div className={styles.login}>
                <Link to='/login'>Login</Link>
            </div>
            <br />
            <input type='submit' value='Submit' />
        </form>
	);
}

ResetForm.propTypes =
{
	reset : React.PropTypes.object.isRequired,
	handleSubmit : React.PropTypes.func.isRequired,
	handleEmailChange : React.PropTypes.func.isRequired,
	handleRecaptchaDone : React.PropTypes.func.isRequired,
	handleRecaptchaExpire : React.PropTypes.func.isRequired,
	setWidgetId : React.PropTypes.func.isRequired
}

export default withStyles(styles)(ResetForm);