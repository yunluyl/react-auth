'use strict';
import React from 'react';
import LoginForm from './LoginForm';
import apiReq from './apiReq';


class LoginContainer extends React.Component
{
    static propTypes =
    {
        recaptcha : React.PropTypes.bool.isRequired,
        sitekey : React.PropTypes.string.isRequired,
        authPath : React.PropTypes.string.isRequired
    };

    state =
    {
        email : '',
        password : '',
        emMsg : '',
        pwMsg : '',
        errorMsg : '',
        isLogin : false
    };

    componentWillMount()
    {
        this.recaptchaValue = '';
        this.widgetId = '';
    }
    componentDidMount()
    {
        
    }
    componentWillUnmount()
    {
        this.setState(
        {
            email : '',
            password : '',
            emMsg : '',
            pwMsg : '',
            errorMsg : '',
            isLogin : false
        });
    }

    loginStart = () =>
    {
        this.setState({isLogin : true});
    };

    loginSucceed = () =>
    {
        this.setState({isLogin : false});
    };

    loginFailed = (err) =>
    {
        this.setState({errorMsg : err.msg, isLogin : false});
    };

    setWidgetId = (id) =>
    {
        this.widgetId = id;
    };

    handleEmailChange = (e) =>
    {
        this.setState({email : e.target.value, emMsg : '', errorMsg : ''});
    };
    handlePasswordChange = (e) =>
    {
        this.setState({password : e.target.value, pwMsg : '', errorMsg : ''});
    };
    handleRecaptchaDone = (g) =>
    {
        this.recaptchaValue = g;
        this.setState({errorMsg : ''});
    };
    handleRecaptchaExpire = () =>
    {
        this.recaptchaValue = 'EXP';
    };
    handleSubmit = (e) =>
    {
        e.preventDefault();
        let email = this.state.email.trim();
        let password = this.state.password.trim();
        let submitForm = true;
        let data = {};
        this.setState({errorMsg : '', password : ''});
        if (email)
        {
            this.setState({emMsg : ''});
        }
        else
        {
            submitForm = false;
            this.setState({emMsg : 'Email is empty'});
        }
        if (password)
        {
            this.setState({pwMsg : ''});
        }
        else
        {
            submitForm = false;
            this.setState({pwMsg : 'Password is empty'});
        }
        if (this.props.recaptcha)
        {
            if (this.recaptchaValue === 'EXP')
            {
                submitForm = false;
                this.setState({errorMsg : 'Recaptcha expired, please check a new recaptcha'});
            }
            else if (this.recaptchaValue)
            {
                this.setState({errorMsg : ''});
            }
            else
            {
                submitForm = false;
                this.setState({errorMsg : 'Recaptcha is not checked'});
            }
            if (submitForm)
            {
                data._id = email;
                data.pw = password;
                data['g-recaptcha-response'] = this.recaptchaValue;
            }
        }
        else
        {
            data._id = email;
            data.pw = password;
        }

        if (this.recaptchaValue)
        {
            grecaptcha.reset(this.widgetId);
            this.recaptchaValue = '';
        }
        if (submitForm)
        {
            apiReq(
                'POST',
                this.props.authPath + '/login',
                data,
                this.loginStart,
                this.loginSucceed,
                this.loginFailed
            );
        }
    };

    render()
    {
        return(
            <LoginForm
                login={this.state}
                recaptcha={this.props.recaptcha}
                sitekey={this.props.sitekey}
                loginStyle={this.props.loginConfig?this.props.loginConfig.style:{}}
                loginClass={this.props.loginConfig?this.props.loginConfig.className:{}}
                handleEmailChange={this.handleEmailChange}
                handlePasswordChange={this.handlePasswordChange}
                handleRecaptchaDone={this.handleRecaptchaDone}
                handleRecaptchaExpire={this.handleRecaptchaExpire}
                handleSubmit={this.handleSubmit}
                setWidgetId={this.setWidgetId}
            />
        );
    }
};

export default LoginContainer;