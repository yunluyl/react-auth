'use strict';
import React from 'react';
import ResetForm from './ResetForm';
import Change from './Change';
import apiReq from './apiReq';

class Reset extends React.Component
{

    static propTypes =
    {
        recaptcha : React.PropTypes.bool.isRequired,
        sitekey : React.PropTypes.string.isRequired,
        authPath : React.PropTypes.string.isRequired
    };

    state =
    {
        activeForm : 'reset',
        email : '',
        emMsg : '',
        errorMsg : '',
        isReset : false,
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
            activeForm : 'reset',
            email : '',
            emMsg : '',
            errorMsg : '',
            isReset : false,
        });
    }

    resetStart = () =>
    {
        this.setState({isReset : true});
        this.props.resetStart();
    };

    resetSuccess = (data) =>
    {
        this.setState({isReset : false, activeForm : 'change'});
        this.props.resetSuccess(data);
    };

    resetFail = (err) =>
    {
        this.setState({errorMsg : err.msg, isReset : false});
        this.props.resetFail(err);
    };

    setWidgetId = (id) =>
    {
        this.widgetId = id;
    };

    setWidgetId = (id) =>
    {
        this.widgetId = id;
    };

    handleEmailChange = (e) =>
    {
        this.setState({email : e.target.value, emMsg : '', errorMsg : ''});
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
        let email = this.props.reset.email.trim();
        let submitForm = true;
        let data = {};
        this.setState({errorMsg : ''});
        if (email)
        {
            this.setState({emMsg : ''});
        }
        else
        {
            submitForm = false;
            this.setState({emMsg : 'Email is empty'});
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
                data['g-recaptcha-response'] = this.recaptchaValue;
            }
        }
        else
        {
            data._id = email;
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
                this.props.authPath + '/reset',
                data,
                this.resetStart,
                this.resetSuccess,
                this.resetFail
            );
        }
    };

    render()
    {
        let activeForm;
        switch (this.state.activeForm)
        {
            case 'reset':
                activeForm = (
                    <ResetForm
                        reset={this.props.reset}
                        recaptcha={this.props.recaptcha}
                        sitekey={this.props.sitekey}
                        resetStyle={this.props.resetConfig?this.props.resetConfig.style:{}}
                        resetClass={this.props.resetConfig?this.props.resetConfig.className:{}}
                        handleSubmit={this.handleSubmit}
                        handleEmailChange={this.handleEmailChange}
                        handleRecaptchaDone={this.handleRecaptchaDone}
                        handleRecaptchaExpire={this.handleRecaptchaExpire}
                        setWidgetId={this.setWidgetId}
                    />
                );
                break;
            case 'change':
                activeForm = (
                    <Change
                        inReset = {true}
                        userID = {this.userID}
                        changeConfig = {this.props.changeConfig}
                        authPath = {this.props.authPath}
                        success = {this.props.changeSuccess}
                        fail = {this.props.changeFail}
                    />
                );
                break;
            default:
                activeForm = null;
        }
        return(
            {activeForm}
        );
    }
}

export default Reset;