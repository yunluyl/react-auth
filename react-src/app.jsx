'use strict';
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import appReducer from './redux/reducer.jsx'
import routes from './routes.jsx';
import WithStylesContext from './WithStylesContext.jsx';

const appState = window.__STATE__;
console.log(appState);
const loggerMiddleware = createLogger();
const store = createStore(appReducer, appState, applyMiddleware(thunkMiddleware)); //, loggerMiddleware

render(
	<Provider store={store}>
			<Router routes={routes} history={browserHistory}/>
	</Provider>,
	document.getElementById('root')
);