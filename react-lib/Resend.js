'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _apiReq = require('./apiReq');

var _apiReq2 = _interopRequireDefault(_apiReq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resend = function (_React$Component) {
	_inherits(Resend, _React$Component);

	function Resend() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Resend);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Resend)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			active: true,
			isGetActive: false,
			isResend: false
		}, _this.getActiveStart = function () {
			_this.setState({ isGetActive: true });
		}, _this.getActiveSuccess = function (data) {
			if (data.active) {
				_this.setState({ isGetActive: false });
			} else {
				_this.setState({
					active: false,
					isGetActive: false
				});
			}
		}, _this.getActiveFail = function (err) {
			_this.setState({ isGetActive: false });
		}, _this.resendStart = function () {
			_this.setState({ isResend: true });
			if (typeof _this.props.start !== 'undefined') {
				_this.props.start();
			}
		}, _this.resendSuccess = function (data) {
			_this.setState({ isResend: false });
			if (typeof _this.props.success !== 'undefined') {
				_this.props.success(data);
			}
		}, _this.resendFail = function (err) {
			_this.setState({ isResend: false });
			if (typeof _this.props.fail !== 'undefined') {
				_this.props.fail(err);
			}
		}, _this.handleResendClick = function (e) {
			(0, _apiReq2.default)('POST', _this.props.authPath + '/resend', undefined, _this.resendStart, _this.resendSuccess, _this.resendFail);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Resend, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			(0, _apiReq2.default)('GET', this.props.authPath + '/isactive', undefined, this.getActiveStart, this.getActiveSuccess, this.getActiveFail);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.setState({
				active: true,
				isGetActive: false,
				isResend: false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var resendButton = void 0;
			if (this.state.active === false) {
				resendButton = _react2.default.createElement(
					'button',
					{
						className: this.props.resendClass ? this.props.resendClass.resendBtn : '',
						style: this.props.resendStyle ? this.props.resendStyle.resendBtn : this.props.resendStyle ? {} : {},
						type: 'button',
						onClick: this.handleResendClick
					},
					'Resend'
				);
			} else {
				resendButton = null;
			}
			return _react2.default.createElement(
				'div',
				null,
				resendButton
			);
		}
	}]);

	return Resend;
}(_react2.default.Component);

Resend.defaultProps = {
	authPath: '/auth'
};
exports.default = Resend;