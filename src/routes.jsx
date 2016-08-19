import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import LoginContainer from './login/LoginContainer.jsx';
import SignupContainer from './signup/SignupContainer.jsx';
import ResetContainer from './reset/ResetContainer.jsx';
import PlanContainer from './plans/PlanContainer.jsx';
import WorkContainer from './workspace/WorkContainer.jsx';
import Index from './index.jsx';

export default (
	<Route>
		<Route path='/' component={Index} />
		<Route path='/login' component={LoginContainer} />
		<Route path='/signup' component={SignupContainer} />
		<Route path='/reset' component={ResetContainer} />
		<Route path='/plans' component={PlanContainer} />
		<Route path='/plans/:id' component={WorkContainer} />
	</Route>
);