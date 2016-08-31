'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SignupForm = require('./SignupForm');

var _SignupForm2 = _interopRequireDefault(_SignupForm);

var _apiReq = require('./apiReq');

var _apiReq2 = _interopRequireDefault(_apiReq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Signup = function (_React$Component) {
    _inherits(Signup, _React$Component);

    function Signup() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, Signup);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Signup)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
            email: '',
            name: '',
            password: '',
            confirm: '',
            emMsg: '',
            dnMsg: '',
            pwMsg: '',
            cpwMsg: '',
            errorMsg: '',
            isSignup: false
        }, _this.signupStart = function () {
            _this.setState({ isSignup: true });
            if (typeof _this.props.start !== 'undefined') {
                _this.props.start();
            }
        }, _this.signupSuccess = function (data) {
            _this.setState({ isSignup: false });
            if (typeof _this.props.success !== 'undefined') {
                _this.props.success(data);
            }
        }, _this.signupFail = function (err) {
            _this.setState({ errorMsg: err.msg, isSignup: false });
            if (typeof _this.props.fail !== 'undefined') {
                _this.props.fail(err);
            }
        }, _this.setWidgetId = function (id) {
            _this.widgetId = id;
        }, _this.handleEmailChange = function (e) {
            _this.setState({ email: e.target.value, emMsg: '', errorMsg: '' });
        }, _this.handleNameChange = function (e) {
            _this.setState({ name: e.target.value, dnMsg: '', errorMsg: '' });
        }, _this.handlePasswordChange = function (e) {
            _this.setState({ password: e.target.value, pwMsg: '', errorMsg: '' });
        }, _this.handleConfirmChange = function (e) {
            _this.setState({ confirm: e.target.value, cpwMsg: '', errorMsg: '' });
        }, _this.handleRecaptchaDone = function (g) {
            _this.recaptchaValue = g;
            _this.setState({ errorMsg: '' });
        }, _this.handleRecaptchaExpire = function () {
            _this.recaptchaValue = 'EXP';
        }, _this.handleSubmit = function (e) {
            e.preventDefault();
            var email = _this.state.email.trim();
            var name = _this.state.name.trim();
            var password = _this.state.password.trim();
            var confirm = _this.state.confirm.trim();
            var submitForm = true;
            var data = {};

            _this.setState({ errorMsg: '', password: '', confirm: '' });
            //Check email is correct
            if (email.match(/^.{1,50}[@].{1,50}[.].{1,50}$/)) {
                _this.setState({ emMsg: '' });
            } else if (email) {
                submitForm = false;
                _this.setState({ emMsg: 'Email address is not in correct format xxx@xxx.xxx' });
            } else {
                submitForm = false;
                _this.setState({ emMsg: 'Email is empty' });
            }
            //Check display name is correct
            if (name) {
                _this.setState({ dnMsg: '' });
            } else {
                submitForm = false;
                _this.setState({ dnMsg: 'Display name is empty' });
            }
            //Check password is correct
            if (password.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/)) {
                _this.setState({ pwMsg: '' });
            } else if (password) {
                submitForm = false;
                _this.setState({ pwMsg: 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters' });
            } else {
                submitForm = false;
                _this.setState({ pwMsg: 'Password is empty' });
            }
            //Check confirm password is correct
            if (password !== confirm) {
                submitForm = false;
                _this.setState({ cpwMsg: 'Password and confirm password are not equal' });
            } else if (!confirm) {
                submitForm = false;
                _this.setState({ cpwMsg: 'Confirm password is empty' });
            } else {
                _this.setState({ cpwMsg: '' });
            }
            //Check recaptcha is correct
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
                    data.dn = name;
                    data.pw = password;
                    data['g-recaptcha-response'] = _this.recaptchaValue;
                }
            } else {
                data._id = email;
                data.dn = name;
                data.pw = password;
            }

            if (_this.recaptchaValue) {
                grecaptcha.reset(_this.widgetId);
                _this.recaptchaValue = '';
            }
            if (submitForm) {
                (0, _apiReq2.default)('POST', _this.props.authPath + '/signup', data, _this.signupStart, _this.signupSuccess, _this.signupFail);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Signup, [{
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
                name: '',
                password: '',
                confirm: '',
                emMsg: '',
                dnMsg: '',
                pwMsg: '',
                cpwMsg: '',
                errorMsg: '',
                isSignup: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_SignupForm2.default, {
                signup: this.state,
                recaptcha: this.props.recaptcha,
                sitekey: this.props.sitekey,
                signupStyle: this.props.signupConfig ? this.props.signupConfig.style : {},
                signupClass: this.props.signupConfig ? this.props.signupConfig.className : {},
                handleSubmit: this.handleSubmit,
                handleEmailChange: this.handleEmailChange,
                handleNameChange: this.handleNameChange,
                handlePasswordChange: this.handlePasswordChange,
                handleConfirmChange: this.handleConfirmChange,
                handleRecaptchaDone: this.handleRecaptchaDone,
                handleRecaptchaExpire: this.handleRecaptchaExpire,
                setWidgetId: this.setWidgetId
            });
        }
    }]);

    return Signup;
}(_react2.default.Component);

Signup.propTypes = {
    recaptcha: _react2.default.PropTypes.bool.isRequired,
    sitekey: _react2.default.PropTypes.string.isRequired,
    authPath: _react2.default.PropTypes.string.isRequired
};
exports.default = Signup;