'use strict';

var api        = require('../utils/api');
var Action     = require('../constants/actions');
var AuthStore  = require('../stores/auth');
var Dispatcher = require('../dispatcher');

/**
 *
 */
module.exports = {
	login:    login,
	logout:   logout,
	loadUser: loadUser,
}

/**
 *
 */
function login(credentials) {
	Dispatcher.dispatch({
		payload: {
			name: credentials.name,
		},
		type: Action.LOGIN,
	});

	function onLoginSuccess(user) {
		Dispatcher.dispatch({
			type:    Action.LOGIN_SUCCESS,
			payload: user,
		});
		return user;
	}

	function onLoginError(err) {
		Dispatcher.dispatch({
			type:    Action.LOGIN_FAILURE,
			payload: err,
		});
	}

	return api.login({ payload: credentials })
		.then(onLoginSuccess, onLoginError);
}

/**
 *
 */
function logout() {
	Dispatcher.dispatch({
		type: Action.LOGOUT,
	});

	function onLogoutSuccess() {
		Dispatcher.dispatch({
			type: Action.LOGOUT_SUCCESS,
		});
	}

	function onLogoutError(err) {
		Dispatcher.dispatch({
			type:    Action.LOGOUT_FAILURE,
			payload: err,
		});
	}

	return api.logout({ token: AuthStore.getToken() })
		.then(onLoginSuccess, onLogoutError);
}

/**
 *
 */
function loadUser() {
	Dispatcher.dispatch({
		type: Action.LOAD_USER,
	});

	function onLoadUserSuccess(user) {
		console.log('loadUser:success:user');
		Dispatcher.dispatch({
			type:    Action.LOAD_USER_SUCCESS,
			payload: user,
		})
	}

	function onLoadUserError(err) {
		Dispatcher.dispatch({
			type:    Action.LOAD_USER_FAILURE,
			payload: err,
		});
	}

	return api.getUser({ token: AuthStore.getToken() })
		.then(onLoadUserSuccess, onLoadUserError);
}
