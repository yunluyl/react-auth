'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Recaptcha = require('./Recaptcha');

var _Recaptcha2 = _interopRequireDefault(_Recaptcha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginForm = function LoginForm(props) {
	return _react2.default.createElement(
		'form',
		{
			className: props.loginClass ? props.loginClass.form : '',
			style: props.loginStyle ? props.loginStyle.form : {},
			onSubmit: props.handleSubmit
		},
		_react2.default.createElement('input', {
			className: props.loginClass ? props.loginClass.emailBox : '',
			style: props.loginStyle ? props.loginStyle.emailBox : {},
			type: 'text',
			placeholder: 'Email address',
			value: props.login.email,
			onChange: props.handleEmailChange
		}),
		_react2.default.createElement(
			'div',
			{
				className: props.loginClass ? props.loginClass.emailError : '',
				style: props.loginStyle ? props.loginStyle.emailError : {}
			},
			props.login.emMsg
		),
		_react2.default.createElement('br', null),
		_react2.default.createElement('input', {
			className: props.loginClass ? props.loginClass.passwordBox : '',
			style: props.loginStyle ? props.loginStyle.passwordBox : {},
			type: 'password',
			placeholder: 'Password',
			value: props.login.password,
			onChange: props.handlePasswordChange
		}),
		_react2.default.createElement(
			'div',
			{
				className: props.loginClass ? props.loginClass.passwordError : '',
				style: props.loginStyle ? props.loginStyle.passwordError : {}
			},
			props.login.pwMsg
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
				className: props.loginClass ? props.loginClass.errorMessage : '',
				style: props.loginStyle ? props.loginStyle.errorMessage : {}
			},
			props.login.errorMsg
		),
		_react2.default.createElement(
			'button',
			{
				className: props.loginClass ? props.loginClass.linkToSignup : '',
				style: props.loginStyle ? props.loginStyle.linkToSignup : {},
				type: 'button'
			},
			'Signup'
		),
		_react2.default.createElement(
			'button',
			{
				className: props.loginClass ? props.loginClass.linkToReset : '',
				style: props.loginStyle ? props.loginStyle.linkToReset : {},
				type: 'button'
			},
			'Forget password'
		),
		_react2.default.createElement('br', null),
		_react2.default.createElement('input', { type: 'submit', value: 'Submit' })
	);
};

LoginForm.propTypes = {
	login: _react2.default.PropTypes.object.isRequired,
	recaptcha: _react2.default.PropTypes.bool.isRequired,
	sitekey: _react2.default.PropTypes.string.isRequired,
	handleEmailChange: _react2.default.PropTypes.func.isRequired,
	handlePasswordChange: _react2.default.PropTypes.func.isRequired,
	handleRecaptchaDone: _react2.default.PropTypes.func.isRequired,
	handleRecaptchaExpire: _react2.default.PropTypes.func.isRequired,
	handleSubmit: _react2.default.PropTypes.func.isRequired,
	setWidgetId: _react2.default.PropTypes.func.isRequired
};

exports.default = LoginForm;