'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChangeForm = function ChangeForm(props) {
	return _react2.default.createElement(
		'form',
		{
			className: props.changeClass ? props.changeClass.form : '',
			style: props.changeStyle ? props.changeStyle.form : props.changeClass ? {} : {},
			onSubmit: props.handleSubmit
		},
		_react2.default.createElement('input', {
			className: props.changeClass ? props.changeClass.oldPwBox : '',
			style: props.changeStyle ? props.changeStyle.oldPwBox : props.changeClass ? {} : {},
			type: props.inReset ? 'text' : 'password',
			placeholder: props.inReset ? 'Secret token' : 'Old password',
			value: props.change.oldPassword,
			onChange: props.handleOldPasswordChange
		}),
		_react2.default.createElement(
			'div',
			{
				className: props.changeClass ? props.changeClass.oldPwError : '',
				style: props.changeStyle ? props.changeStyle.oldPwError : props.changeClass ? {} : {}
			},
			props.change.oldPasswordMsg
		),
		_react2.default.createElement('input', {
			className: props.changeClass ? props.changeClass.newPwBox : '',
			style: props.changeStyle ? props.changeStyle.newPwBox : props.changeClass ? {} : {},
			type: 'password',
			placeholder: 'New password',
			value: props.change.newPassword,
			onChange: props.handleNewPasswordChange
		}),
		_react2.default.createElement(
			'div',
			{
				className: props.changeClass ? props.changeClass.newPwError : '',
				style: props.changeStyle ? props.changeStyle.newPwError : props.changeClass ? {} : {}
			},
			props.change.newPasswordMsg
		),
		_react2.default.createElement('input', {
			className: props.changeClass ? props.changeClass.confirmBox : '',
			style: props.changeStyle ? props.changeStyle.confirmBox : props.changeClass ? {} : {},
			type: 'password',
			placeholder: 'Confirm new password',
			value: props.change.confirm,
			onChange: props.handleConfirmChange
		}),
		_react2.default.createElement(
			'div',
			{
				className: props.changeClass ? props.changeClass.confirmError : '',
				style: props.changeStyle ? props.changeStyle.confirmError : props.changeClass ? {} : {}
			},
			props.change.confirmMsg
		),
		_react2.default.createElement(
			'div',
			{
				className: props.changeClass ? props.changeClass.errorMessage : '',
				style: props.changeStyle ? props.changeStyle.errorMessage : props.changeClass ? {} : {}
			},
			props.change.errorMsg
		),
		_react2.default.createElement('input', { type: 'submit', value: 'Submit' })
	);
};

ChangeForm.propTypes = {
	change: _react2.default.PropTypes.object.isRequired,
	inReset: _react2.default.PropTypes.bool.isRequired,
	handleOldPasswordChange: _react2.default.PropTypes.func.isRequired,
	handleNewPasswordChange: _react2.default.PropTypes.func.isRequired,
	handleConfirmChange: _react2.default.PropTypes.func.isRequired,
	handleSubmit: _react2.default.PropTypes.func.isRequired
};

exports.default = ChangeForm;