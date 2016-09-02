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

var Logout = function (_React$Component) {
	_inherits(Logout, _React$Component);

	function Logout() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Logout);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Logout)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			isLogout: false
		}, _this.logoutStart = function () {
			_this.setState({ isLogout: true });
			if (typeof _this.props.start !== 'undefined') {
				_this.props.start();
			}
		}, _this.logoutSuccess = function (data) {
			_this.setState({ isLogout: false });
			if (typeof _this.props.success !== 'undefined') {
				_this.props.success(data);
			}
		}, _this.logoutFail = function (err) {
			_this.setState({ isLogout: false });
			if (typeof _this.props.fail !== 'undefined') {
				_this.props.fail(err);
			}
		}, _this.handleLogoutClick = function (e) {
			(0, _apiReq2.default)('POST', _this.props.authPath + '/logout', undefined, _this.logoutStart, _this.logoutSuccess, _this.logoutFail);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Logout, [{
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.setState({ isLogout: false });
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'button',
				{
					className: this.props.logoutClass ? this.props.logoutClass.logoutBtn : '',
					style: this.props.logoutStyle ? this.props.logoutStyle.logoutBtn : this.props.logoutClass ? {} : {},
					type: 'button',
					onClick: this.handleLogoutClick
				},
				'Logout'
			);
		}
	}]);

	return Logout;
}(_react2.default.Component);

Logout.defaultProps = {
	authPath: '/auth'
};
exports.default = Logout;