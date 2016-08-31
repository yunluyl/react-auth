'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ResetForm = require('./ResetForm');

var _ResetForm2 = _interopRequireDefault(_ResetForm);

var _Change = require('./Change');

var _Change2 = _interopRequireDefault(_Change);

var _apiReq = require('./apiReq');

var _apiReq2 = _interopRequireDefault(_apiReq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reset = function (_React$Component) {
    _inherits(Reset, _React$Component);

    function Reset() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, Reset);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Reset)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
            activeForm: 'reset',
            email: '',
            emMsg: '',
            errorMsg: '',
            isReset: false
        }, _this.resetStart = function () {
            _this.setState({ isReset: true });
            if (typeof _this.props.resetStart !== 'undefined') {
                _this.props.resetStart();
            }
        }, _this.resetSuccess = function (data) {
            _this.setState({ isReset: false, activeForm: 'change' });
            if (typeof _this.props.resetSuccess !== 'undefined') {
                _this.props.resetSuccess(data);
            }
        }, _this.resetFail = function (err) {
            _this.setState({ errorMsg: err.msg, isReset: false });
            delete _this.userID;
            if (typeof _this.props.resetFail !== 'undefined') {
                _this.props.resetFail(err);
            }
        }, _this.setWidgetId = function (id) {
            _this.widgetId = id;
        }, _this.setWidgetId = function (id) {
            _this.widgetId = id;
        }, _this.handleEmailChange = function (e) {
            _this.setState({ email: e.target.value, emMsg: '', errorMsg: '' });
        }, _this.handleRecaptchaDone = function (g) {
            _this.recaptchaValue = g;
            _this.setState({ errorMsg: '' });
        }, _this.handleRecaptchaExpire = function () {
            _this.recaptchaValue = 'EXP';
        }, _this.handleSubmit = function (e) {
            e.preventDefault();
            var email = _this.state.email.trim();
            var submitForm = true;
            var data = {};
            _this.setState({ errorMsg: '' });
            if (email) {
                _this.setState({ emMsg: '' });
            } else {
                submitForm = false;
                _this.setState({ emMsg: 'Email is empty' });
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
                    data['g-recaptcha-response'] = _this.recaptchaValue;
                }
            } else {
                data._id = email;
            }
            if (_this.recaptchaValue) {
                grecaptcha.reset(_this.widgetId);
                _this.recaptchaValue = '';
            }
            if (submitForm) {
                _this.userID = email;
                (0, _apiReq2.default)('POST', _this.props.authPath + '/reset', data, _this.resetStart, _this.resetSuccess, _this.resetFail);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Reset, [{
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
                activeForm: 'reset',
                email: '',
                emMsg: '',
                errorMsg: '',
                isReset: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var activeForm = void 0;
            switch (this.state.activeForm) {
                case 'reset':
                    activeForm = _react2.default.createElement(_ResetForm2.default, {
                        reset: this.state,
                        recaptcha: this.props.recaptcha,
                        sitekey: this.props.sitekey,
                        resetStyle: this.props.resetConfig ? this.props.resetConfig.style : {},
                        resetClass: this.props.resetConfig ? this.props.resetConfig.className : {},
                        handleSubmit: this.handleSubmit,
                        handleEmailChange: this.handleEmailChange,
                        handleRecaptchaDone: this.handleRecaptchaDone,
                        handleRecaptchaExpire: this.handleRecaptchaExpire,
                        setWidgetId: this.setWidgetId
                    });
                    break;
                case 'change':
                    activeForm = _react2.default.createElement(_Change2.default, {
                        inReset: true,
                        userID: this.userID,
                        changeConfig: this.props.changeConfig,
                        authPath: this.props.authPath,
                        start: this.props.changeStart,
                        success: this.props.changeSuccess,
                        fail: this.props.changeFail
                    });
                    break;
                default:
                    activeForm = null;
            }
            return _react2.default.createElement(
                'div',
                null,
                activeForm
            );
        }
    }]);

    return Reset;
}(_react2.default.Component);

Reset.propTypes = {
    recaptcha: _react2.default.PropTypes.bool.isRequired,
    sitekey: _react2.default.PropTypes.string.isRequired,
    authPath: _react2.default.PropTypes.string.isRequired
};
exports.default = Reset;