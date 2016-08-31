'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Recaptcha = require('./Recaptcha.js');

var _Recaptcha2 = _interopRequireDefault(_Recaptcha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SignupForm = function SignupForm(props) {
    return _react2.default.createElement(
        'form',
        {
            className: props.signupClass ? props.signupClass.form : '',
            style: props.signupStyle ? props.signupStyle.form : {},
            onSubmit: props.handleSubmit
        },
        _react2.default.createElement('input', {
            className: props.signupClass ? props.signupClass.emailBox : '',
            style: props.signupStyle ? props.signupStyle.emailBox : {},
            type: 'text',
            placeholder: 'Email address',
            value: props.signup.email,
            onChange: props.handleEmailChange
        }),
        _react2.default.createElement(
            'div',
            {
                className: props.signupClass ? props.signupClass.emailError : '',
                style: props.signupStyle ? props.signupStyle.emailError : {}
            },
            props.signup.emMsg
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', {
            className: props.signupClass ? props.signupClass.nameBox : '',
            style: props.signupStyle ? props.signupStyle.nameBox : {},
            type: 'text',
            placeholder: 'Display name',
            value: props.signup.name,
            onChange: props.handleNameChange
        }),
        _react2.default.createElement(
            'div',
            {
                className: props.signupClass ? props.signupClass.nameError : '',
                style: props.signupStyle ? props.signupStyle.nameError : {}
            },
            props.signup.dnMsg
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', {
            className: props.signupClass ? props.signupClass.passwordBox : '',
            style: props.signupStyle ? props.signupStyle.passwordBox : {},
            type: 'password',
            placeholder: 'Password',
            value: props.signup.password,
            onChange: props.handlePasswordChange
        }),
        _react2.default.createElement(
            'div',
            {
                className: props.signupClass ? props.signupClass.passwordError : '',
                style: props.signupStyle ? props.signupStyle.passwordError : {}
            },
            props.signup.pwMsg
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', {
            className: props.signupClass ? props.signupClass.confirmBox : '',
            style: props.signupStyle ? props.signupStyle.confirmBox : {},
            type: 'password',
            placeholder: 'Confirm password',
            value: props.signup.confirm,
            onChange: props.handleConfirmChange
        }),
        _react2.default.createElement(
            'div',
            {
                className: props.signupClass ? props.signupClass.confirmError : '',
                style: props.signupStyle ? props.signupStyle.confirmError : {}
            },
            props.signup.cpwMsg
        ),
        props.recaptcha ? _react2.default.createElement(_Recaptcha2.default, {
            sitekey: props.sitekey,
            handleRecaptchaDone: props.handleRecaptchaDone,
            handleRecaptchaExpire: props.handleRecaptchaExpire,
            setWidgetId: props.setWidgetId
        }) : _react2.default.createElement('div', { id: 'no-recaptcha' }),
        _react2.default.createElement(
            'div',
            {
                className: props.signupClass ? props.signupClass.errorMessage : '',
                style: props.signupStyle ? props.signupStyle.errorMessage : {}
            },
            props.signup.errorMsg
        ),
        _react2.default.createElement('input', { type: 'submit', value: 'Submit' })
    );
};

SignupForm.propTypes = {
    signup: _react2.default.PropTypes.object.isRequired,
    recaptcha: _react2.default.PropTypes.bool.isRequired,
    sitekey: _react2.default.PropTypes.string.isRequired,
    handleSubmit: _react2.default.PropTypes.func.isRequired,
    handleEmailChange: _react2.default.PropTypes.func.isRequired,
    handleNameChange: _react2.default.PropTypes.func.isRequired,
    handlePasswordChange: _react2.default.PropTypes.func.isRequired,
    handleConfirmChange: _react2.default.PropTypes.func.isRequired,
    handleRecaptchaDone: _react2.default.PropTypes.func.isRequired,
    handleRecaptchaExpire: _react2.default.PropTypes.func.isRequired,
    setWidgetId: _react2.default.PropTypes.func.isRequired
};

exports.default = SignupForm;