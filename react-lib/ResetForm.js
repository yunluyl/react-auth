'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Recaptcha = require('./Recaptcha');

var _Recaptcha2 = _interopRequireDefault(_Recaptcha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResetForm = function ResetForm(props) {
    return _react2.default.createElement(
        'form',
        {
            className: props.resetClass ? props.resetClass.form : '',
            style: props.resetStyle ? props.resetStyle.form : {},
            onSubmit: props.handleSubmit
        },
        _react2.default.createElement('input', {
            className: props.resetClass ? props.resetClass.emailBox : '',
            style: props.resetStyle ? props.resetStyle.emailBox : {},
            type: 'text',
            placeholder: 'Email address',
            value: props.reset.email,
            onChange: props.handleEmailChange
        }),
        _react2.default.createElement(
            'div',
            {
                className: props.resetClass ? props.resetClass.emailError : '',
                style: props.resetStyle ? props.resetStyle.emailError : {}
            },
            props.reset.emMsg
        ),
        _react2.default.createElement('br', null),
        props.recaptcha ? _react2.default.createElement(_Recaptcha2.default, {
            sitekey: props.sitekey,
            handleRecaptchaDone: props.handleRecaptchaDone,
            handleRecaptchaExpire: props.handleRecaptchaExpire,
            setWidgetId: props.setWidgetId
        }) : _react2.default.createElement('div', { id: 'no-recaptcha' }),
        _react2.default.createElement(
            'div',
            {
                className: props.resetClass ? props.resetClass.errorMessage : '',
                style: props.resetStyle ? props.resetStyle.errorMessage : {}
            },
            props.reset.errorMsg
        ),
        _react2.default.createElement('input', { type: 'submit', value: 'Submit' })
    );
};

ResetForm.propTypes = {
    reset: _react2.default.PropTypes.object.isRequired,
    recaptcha: _react2.default.PropTypes.bool.isRequired,
    sitekey: _react2.default.PropTypes.string.isRequired,
    handleSubmit: _react2.default.PropTypes.func.isRequired,
    handleEmailChange: _react2.default.PropTypes.func.isRequired,
    handleRecaptchaDone: _react2.default.PropTypes.func.isRequired,
    handleRecaptchaExpire: _react2.default.PropTypes.func.isRequired,
    setWidgetId: _react2.default.PropTypes.func.isRequired
};

exports.default = ResetForm;