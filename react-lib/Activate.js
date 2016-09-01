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

var Activate = function (_React$Component) {
	_inherits(Activate, _React$Component);

	function Activate() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Activate);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Activate)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			message: '',
			isActivate: false
		}, _this.activateStart = function () {
			_this.setState({ isActivate: true });
			if (typeof _this.props.start !== 'undefined') {
				_this.props.start();
			}
		}, _this.activateSuccess = function (data) {
			_this.setState({ message: 'User ' + _this._id + ' has been activated', isActivate: false });
			if (typeof _this.props.success !== 'undefined') {
				_this.props.success(data);
			}
		}, _this.activateFail = function (err) {
			_this.setState({ message: err.msg, isActivate: false });
			if (typeof _this.props.fail !== 'undefined') {
				_this.props.fail(err);
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Activate, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var query = window.location.search.substring(1);
			var vars = query.split('&');
			var data = {};
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (pair[0] === '_id') {
					this._id = pair[1];
					data._id = pair[1];
				} else if (pair[0] == 'tk') {
					data.tk = pair[1];
				}
			}
			(0, _apiReq2.default)('POST', this.props.authPath + '/activate', data, this.activateStart, this.activateSuccess, this.activateFail);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.setState({
				message: '',
				isActivate: false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{
					className: this.props.activateClass ? this.props.activateClass.messageBox : '',
					style: this.props.activateStyle ? this.props.activateStyle.messageBox : this.props.activateClass ? {} : {}
				},
				this.state.message
			);
		}
	}]);

	return Activate;
}(_react2.default.Component);

Activate.defaultProps = {
	authPath: '/auth'
};
exports.default = Activate;