'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LoginForm = require('./LoginForm');

var _LoginForm2 = _interopRequireDefault(_LoginForm);

var _apiReq = require('./apiReq');

var _apiReq2 = _interopRequireDefault(_apiReq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginContainer = function (_React$Component) {
    _inherits(LoginContainer, _React$Component);

    function LoginContainer() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, LoginContainer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LoginContainer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
            email: '',
            password: '',
            emMsg: '',
            pwMsg: '',
            errorMsg: '',
            isLogin: false
        }, _this.loginStart = function () {
            _this.setState({ isLogin: true });
        }, _this.loginSucceed = function () {
            _this.setState({ isLogin: false });
        }, _this.loginFailed = function (err) {
            _this.setState({ errorMsg: err.msg, isLogin: false });
        }, _this.setWidgetId = function (id) {
            _this.widgetId = id;
        }, _this.handleEmailChange = function (e) {
            _this.setState({ email: e.target.value, emMsg: '', errorMsg: '' });
        }, _this.handlePasswordChange = function (e) {
            _this.setState({ password: e.target.value, pwMsg: '', errorMsg: '' });
        }, _this.handleRecaptchaDone = function (g) {
            _this.recaptchaValue = g;
            _this.setState({ errorMsg: '' });
        }, _this.handleRecaptchaExpire = function () {
            _this.recaptchaValue = 'EXP';
        }, _this.handleSubmit = function (e) {
            e.preventDefault();
            var email = _this.state.email.trim();
            var password = _this.state.password.trim();
            var submitForm = true;
            var data = {};
            _this.setState({ errorMsg: '', password: '' });
            if (email) {
                _this.setState({ emMsg: '' });
            } else {
                submitForm = false;
                _this.setState({ emMsg: 'Email is empty' });
            }
            if (password) {
                _this.setState({ pwMsg: '' });
            } else {
                submitForm = false;
                _this.setState({ pwMsg: 'Password is empty' });
            }
            if (_this.props.recaptcha) {
                if (_this.recaptchaValue === 'EXP') {
                    submitForm = false;
                    _this.setState({ errorMsg: 'Recaptcha expired, please check a new recaptcha' });
                } else if (_this.recaptchaValue) {
                    _this.setState({ errorMsg: '' });
                } else {
                    submitForm = false;
                    _this.setState({ errorMsg: 'Recaptcha is not checked' });
                }
                if (submitForm) {
                    data._id = email;
                    data.pw = password;
                    data['g-recaptcha-response'] = _this.recaptchaValue;
                }
            } else {
                data._id = email;
                data.pw = password;
            }

            if (_this.recaptchaValue) {
                grecaptcha.reset(_this.widgetId);
                _this.recaptchaValue = '';
            }
            if (submitForm) {
                (0, _apiReq2.default)('POST', _this.props.authPath + '/login', data, _this.loginStart, _this.loginSucceed, _this.loginFailed);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LoginContainer, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.recaptchaValue = '';
            this.widgetId = '';
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.setState({
                email: '',
                password: '',
                emMsg: '',
                pwMsg: '',
                errorMsg: '',
                isLogin: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_LoginForm2.default, {
                login: this.state,
                recaptcha: this.props.recaptcha,
                sitekey: this.props.sitekey,
                loginStyle: this.props.loginConfig ? this.props.loginConfig.style : {},
                loginClass: this.props.loginConfig ? this.props.loginConfig.className : {},
                handleEmailChange: this.handleEmailChange,
                handlePasswordChange: this.handlePasswordChange,
                handleRecaptchaDone: this.handleRecaptchaDone,
                handleRecaptchaExpire: this.handleRecaptchaExpire,
                handleSubmit: this.handleSubmit,
                setWidgetId: this.setWidgetId
            });
        }
    }]);

    return LoginContainer;
}(_react2.default.Component);

LoginContainer.propTypes = {
    recaptcha: _react2.default.PropTypes.bool.isRequired,
    sitekey: _react2.default.PropTypes.string.isRequired,
    authPath: _react2.default.PropTypes.string.isRequired
};
;

exports.default = LoginContainer;