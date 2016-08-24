'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (method, path, data, start, success, fail) {
	var request = {
		method: method,
		credentials: 'same-origin',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	};
	start();
	(0, _isomorphicFetch2.default)(path, request).then(function (response) {
		if (response.status === 200) {
			if (response.headers.get('Content-Type') === 'application/json; charset=utf-8') {
				return response.json().then(function (json) {
					success(json);
					console.log('succeeded!');
					console.log(json);
					if (json.hasOwnProperty('redirect')) {
						browserHistory.push(json.redirect);
					}
				});
			}
			//possible other types
			else if (response.headers.get('Content-Type') === 'text/html; charset=utf-8') {
					return response.text().then(function (text) {
						console.log(text);
						var error = new Error('Server returned html file');
						error.response = response;
						throw error;
					});
				} else {
					var error = new Error('Illegal Content-Type: ' + response.headers.get('Content-Type'));
					error.response = response;
					throw error;
				}
		} else {
			return response.json().then(function (json) {
				fail(json);
				console.log('failed!');
				console.log(json);
				if (json.hasOwnProperty('err')) {
					console.log(json.err);
				}
			}).catch(function (e) {
				var error = new Error(response.statusText);
				error.response = response;
				throw error;
			});
		}
	}).catch(function (err) {
		fail({ msg: err.message });
		console.log(err);
	});
};