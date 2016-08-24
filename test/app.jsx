'use strict';
import React from 'react';
import {render} from 'react-dom';
import Auth from '../react-lib/Auth';

const authConfig =
{
	authPath : '/auth',
	recaptcha : false,
	sitekey : '6LfqHigTAAAAAN3M7N_PRfODACcRtG1WnTnjgbxd',
	login :
	{
		style :
		{
			form :
			{

			},
			emailBox :
			{

			},
			emailError :
			{
				display: 'inline-block'
			},
			passwordBox :
			{

			},
			passwordError :
			{
				display: 'inline-block'
			},
			errorMessage :
			{
				height: '20px',
				backgroundColor: 'red'
			},
			linkToSignup :
			{
				display: 'inline-block'
			},
			linkToReset :
			{
				marginLeft: '50px',
				display: 'inline-block'
			}
		},
		//or classname
	},
	reset :
	{

	},
	signup :
	{

	}
};

render(
	<Auth authConfig = {authConfig} />,
	document.getElementById('root')
);