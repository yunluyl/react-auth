'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChangeForm = require('./ChangeForm');

var _ChangeForm2 = _interopRequireDefault(_ChangeForm);

var _apiReq = require('./apiReq');

var _apiReq2 = _interopRequireDefault(_apiReq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Change = function (_React$Component) {
	_inherits(Change, _React$Component);

	function Change() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Change);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Change)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			oldPassword: '',
			newPassword: '',
			confirm: '',
			oldPasswordMsg: '',
			newPasswordMsg: '',
			confirmMsg: '',
			errorMsg: '',
			isChange: false
		}, _this.changeStart = function () {
			_this.setState({ isChange: true });
			if (typeof _this.props.start !== 'undefined') {
				_this.props.start();
			}
		}, _this.changeSuccess = function (data) {
			_this.setState({ isChange: false });
			if (typeof _this.props.success !== 'undefined') {
				_this.props.success(data);
			}
		}, _this.changeFail = function (err) {
			_this.setState({ errorMsg: err.msg, isChange: false });
			if (typeof _this.props.fail !== 'undefined') {
				_this.props.fail(err);
			}
		}, _this.handleOldPasswordChange = function (e) {
			_this.setState({ oldPassword: e.target.value, errorMsg: '' });
		}, _this.handleNewPasswordChange = function (e) {
			_this.setState({ newPassword: e.target.value, newPasswordMsg: '', errorMsg: '' });
		}, _this.handleConfirmChange = function (e) {
			_this.setState({ confirm: e.target.value, confirmMsg: '', errorMsg: '' });
		}, _this.handleSubmit = function (e) {
			e.preventDefault();
			var oldPassword = _this.state.oldPassword.trim();
			var newPassword = _this.state.newPassword.trim();
			var confirm = _this.state.confirm.trim();
			var submitForm = true;
			var data = {};
			var clearInputs = void 0;

			if (_this.props.inReset) {
				clearInputs = {
					newPassword: '',
					confirm: '',
					errorMsg: ''
				};
			} else {
				clearInputs = {
					oldPassword: '',
					newPassword: '',
					confirm: '',
					errorMsg: ''
				};
			}
			_this.setState(clearInputs);

			//Check old password is correct
			if (oldPassword) {
				_this.setState({ oldPasswordMsg: '' });
			} else {
				submitForm = false;
				var msgTemp = _this.props.inReset ? 'Secret token cannot be empty' : 'Old password cannot be empty';
				_this.setState({ oldPasswordMsg: msgTemp });
			}

			//Check new password is correct
			if (newPassword.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/)) {
				_this.setState({ newPasswordMsg: '' });
			} else if (newPassword) {
				submitForm = false;
				_this.setState({ newPasswordMsg: 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters' });
			} else {
				submitForm = false;
				_this.setState({ newPasswordMsg: 'Password is empty' });
			}
			//Check confirm password is correct
			if (newPassword !== confirm) {
				submitForm = false;
				_this.setState({ confirmMsg: 'Password and confirm password are not equal' });
			} else if (!confirm) {
				submitForm = false;
				_this.setState({ confirmMsg: 'Confirm password is empty' });
			} else {
				_this.setState({ confirmMsg: '' });
			}
			data.pw = oldPassword;
			data.np = newPassword;
			if (_this.props.inReset) {
				data._id = _this.props.userID;
			}
			if (submitForm) {
				(0, _apiReq2.default)('POST', _this.props.authPath + '/change', data, _this.changeStart, _this.changeSuccess, _this.changeFail);
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Change, [{
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.setState({
				oldPassword: '',
				newPassword: '',
				confirm: '',
				oldPasswordMsg: '',
				newPasswordMsg: '',
				confirmMsg: '',
				errorMsg: '',
				isChange: false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(_ChangeForm2.default, {
				change: this.state,
				inReset: this.props.inReset,
				changStyle: this.props.changeConfig ? this.props.changeConfig.style : {},
				changeClass: this.props.changeConfig ? this.props.changeConfig.className : {},
				handleOldPasswordChange: this.handleOldPasswordChange,
				handleNewPasswordChange: this.handleNewPasswordChange,
				handleConfirmChange: this.handleConfirmChange,
				handleSubmit: this.handleSubmit
			});
		}
	}]);

	return Change;
}(_react2.default.Component);

Change.defaultProps = {
	inReset: false
};
Change.propTypes = {
	authPath: _react2.default.PropTypes.string.isRequired
};
exports.default = Change;