'use strict';
import React from 'react';
import SignupForm from './SignupForm';
import apiReq from './apiReq';

class Signup extends React.Component
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
        name : '',
        password : '',
        confirm : '',
        emMsg : '',
        dnMsg : '',
        pwMsg : '',
        cpwMsg : '',
        errorMsg : '',
        isSignup : false,
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
            name : '',
            password : '',
            confirm : '',
            emMsg : '',
            dnMsg : '',
            pwMsg : '',
            cpwMsg : '',
            errorMsg : '',
            isSignup : false,
        });
    }

    signupStart = () =>
    {
        this.setState({isSignup : true});
        if (typeof this.props.start !== 'undefined')
        {
            this.props.start();
        }
    };

    signupSuccess = (data) =>
    {
        this.setState({isSignup : false});
        if (typeof this.props.success !== 'undefined')
        {
            this.props.success(data);
        }
    };

    signupFail = (err) =>
    {
        this.setState({errorMsg : err.msg, isSignup : false});
        if (typeof this.props.fail !== 'undefined')
        {
            this.props.fail(err);
        }
    };

    setWidgetId = (id) =>
    {
        this.widgetId = id;
    };

    handleEmailChange = (e) =>
    {
        this.setState({email : e.target.value, emMsg : '', errorMsg : ''});
    };

    handleNameChange = (e) =>
    {
        this.setState({name : e.target.value, dnMsg : '', errorMsg : ''});
    };
    
    handlePasswordChange = (e) =>
    {
        this.setState({password : e.target.value, pwMsg : '', errorMsg : ''});
    };

    handleConfirmChange = (e) =>
    {
        this.setState({confirm : e.target.value, cpwMsg : '', errorMsg : ''});
    };

    handleRecaptchaDone= (g) =>
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
        let name = this.state.name.trim();
        let password = this.state.password.trim();
        let confirm = this.state.confirm.trim();
        let submitForm = true;
        let data = {};
        
        this.setState({errorMsg : '', password : '', confirm : ''});
        //Check email is correct
        if (email.match(/^.{1,50}[@].{1,50}[.].{1,50}$/))
        {
            this.setState({emMsg : ''});
        }
        else if (email)
        {
            submitForm = false;
            this.setState({emMsg : 'Email address is not in correct format xxx@xxx.xxx'});
        }
        else
        {
            submitForm = false;
            this.setState({emMsg : 'Email is empty'});
        }
        //Check display name is correct
        if (name)
        {
            this.setState({dnMsg : ''});
        }
        else
        {
            submitForm = false;
            this.setState({dnMsg : 'Display name is empty'});
        }
        //Check password is correct
        if (password.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/))
        {
            this.setState({pwMsg : ''});
        }
        else if (password)
        {
            submitForm = false;
            this.setState({pwMsg : 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters'})
        }
        else
        {
            submitForm = false;
            this.setState({pwMsg : 'Password is empty'});
        }
        //Check confirm password is correct
        if (password !== confirm)
        {
            submitForm = false;
            this.setState({cpwMsg : 'Password and confirm password are not equal'});
        }
        else if (!confirm)
        {
            submitForm = false;
            this.setState({cpwMsg : 'Confirm password is empty'});
        }
        else
        {
            this.setState({cpwMsg : ''});
        }
        //Check recaptcha is correct
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
                data.dn = name;
                data.pw = password;
                data['g-recaptcha-response'] = this.recaptchaValue;
            }
        }
        else
        {
            data._id = email;
            data.dn = name;
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
                this.props.authPath + '/signup',
                data,
                this.signupStart,
                this.signupSuccess,
                this.signupFail
            );
        }
    };

    render()
    {
        return(
            <SignupForm
                signup={this.state}
                recaptcha={this.props.recaptcha}
                sitekey={this.props.sitekey}
                signupStyle={this.props.signupConfig?this.props.signupConfig.style:{}}
                signupClass={this.props.signupConfig?this.props.signupConfig.className:{}}
                handleSubmit={this.handleSubmit}
                handleEmailChange={this.handleEmailChange}
                handleNameChange={this.handleNameChange}
                handlePasswordChange={this.handlePasswordChange}
                handleConfirmChange={this.handleConfirmChange}
                handleRecaptchaDone={this.handleRecaptchaDone}
                handleRecaptchaExpire={this.handleRecaptchaExpire}
                setWidgetId={this.setWidgetId}
            />
        );
    }
}

export default Signup;