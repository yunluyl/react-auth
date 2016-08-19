import {combineReducers} from  'redux';
import serverReducer from './serverReducer.jsx';
import loginReducer from '../login/loginReducer.jsx';
import signupReducer from '../signup/signupReducer.jsx';
import resetReducer from '../reset/resetReducer.jsx';
import planReducer from '../plans/planReducer.jsx';
import workReducer from '../workspace/workReducer.jsx';

export default combineReducers(
{
	serverReducer,
	loginReducer,
	signupReducer,
	resetReducer,
	planReducer,
	workReducer
});