'use strict';
import React from 'react';
import {connect} from 'react-redux';
import SignupForm from './SignupForm.jsx';
import * as action from './signupActions.jsx';
import {mountData} from '../redux/actionDefines.jsx';

class SignupContainer extends React.Component
{
    componentWillMount()
    {
        this.recaptcha = '';
        this.widgetId = '';
    }
    componentDidMount()
    {
        mountData(this.props.dispatch, this.props.serverRender);
        this.props.dispatch(action.fetchRecap());
    }
    componentWillUnmount()
    {
        this.props.dispatch(action.reset());
    }

    setWidgetId = (id) =>
    {
        this.widgetId = id;
    };

    handleEmailChange = (e) =>
    {
        this.props.dispatch(action.setEmail(e.target.value));
    };

    handleNameChange = (e) =>
    {
        this.props.dispatch(action.setName(e.target.value));
    };
    
    handlePasswordChange = (e) =>
    {
        this.props.dispatch(action.setPassword(e.target.value));
    };

    handleConfirmChange = (e) =>
    {
        this.props.dispatch(action.setConfirm(e.target.value));
    };

    handleRecaptchaDone= (g) =>
    {
        this.recaptcha = g;
    };

    handleRecaptchaExpire = () =>
    {
        this.recaptcha = 'EXP';
    };
    
    handleSubmit = (e) =>
    {
        e.preventDefault();
        const dispatch = this.props.dispatch;
        let email = this.props.signup.email.trim();
        let name = this.props.signup.name.trim();
        let password = this.props.signup.password.trim();
        let confirm = this.props.signup.confirm.trim();
        let submitForm = {v : true};
        let data = {};
        dispatch(action.checkForm(submitForm, email, name, password,
                                confirm, this.props.signup.dorecaptcha,
                                this.recaptcha, data));
        if (this.recaptcha)
        {
            grecaptcha.reset(this.widgetId);
            this.recaptcha = '';
        }
        if (submitForm.v)
        {
            dispatch(action.signup(data));
        }
    };

    render()
    {
        return(
            <div>
                <SignupForm
                    signup={this.props.signup}
                    handleSubmit={this.handleSubmit}
                    handleEmailChange={this.handleEmailChange}
                    handleNameChange={this.handleNameChange}
                    handlePasswordChange={this.handlePasswordChange}
                    handleConfirmChange={this.handleConfirmChange}
                    handleRecaptchaDone={this.handleRecaptchaDone}
                    handleRecaptchaExpire={this.handleRecaptchaExpire}
                    setWidgetId={this.setWidgetId}
                />
            </div>
        );
    }
}

const mapState = (state) =>
{
    return {
        serverRender : state.serverReducer.serverRender,
        signup : state.signupReducer
    };
}

export default connect(mapState)(SignupContainer);