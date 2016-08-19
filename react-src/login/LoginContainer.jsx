'use strict';
import React from 'react';
import {connect} from 'react-redux';
import LoginForm from './LoginForm.jsx';
import * as action from './loginActions.jsx';
import {mountData} from '../redux/actionDefines.jsx';

class LoginContainer extends React.Component
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
    handlePasswordChange = (e) =>
    {
        this.props.dispatch(action.setPassword(e.target.value));
    };
    handleRecaptchaDone = (g) =>
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
        let email = this.props.login.email.trim();
        let password = this.props.login.password.trim();
        let submitForm = {v : true};
        let data = {};
        dispatch(action.checkForm(submitForm, email, password,
                                this.props.login.dorecaptcha,
                                this.recaptcha, data));
        if (this.recaptcha)
        {
            grecaptcha.reset(this.widgetId);
            this.recaptcha = '';
        }
        if (submitForm.v)
        {
            dispatch(action.login(data));
        }
    };

    render()
    {
        return(
            <div>
                <LoginForm
                    login={this.props.login}
                    handleEmailChange={this.handleEmailChange}
                    handlePasswordChange={this.handlePasswordChange}
                    handleRecaptchaDone={this.handleRecaptchaDone}
                    handleRecaptchaExpire={this.handleRecaptchaExpire}
                    handleSubmit={this.handleSubmit}
                    setWidgetId={this.setWidgetId}
                />
            </div>
        );
    }
};

const mapState = (state) =>
{
    return {
        serverRender : state.serverReducer.serverRender,
        login : state.loginReducer
    };
};

export default connect(mapState)(LoginContainer);