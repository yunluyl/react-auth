'use strict';
import React from 'react';
import {connect} from 'react-redux';
import ResetForm from './ResetForm.jsx';
import * as action from './resetActions.jsx';
import {mountData} from '../redux/actionDefines.jsx';

class ResetContainer extends React.Component
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
        let email = this.props.reset.email.trim();
        let submitForm = {v : true};
        let data = {};
        dispatch(action.checkForm(submitForm, email,
                                this.props.reset.dorecaptcha,
                                this.recaptcha, data));
        if (this.recaptcha)
        {
            grecaptcha.reset(this.widgetId);
            this.recaptcha = '';
        }
        if (submitForm.v)
        {
            dispatch(action.forgetPassword(data));
        }
    };

    render()
    {
        return(
            <div>
                <ResetForm
                    reset={this.props.reset}
                    handleSubmit={this.handleSubmit}
                    handleEmailChange={this.handleEmailChange}
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
        reset : state.resetReducer
    };
}

export default connect(mapState)(ResetContainer);