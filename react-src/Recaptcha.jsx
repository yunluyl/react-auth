'use strict';
import React from 'react';

export default class Recaptcha extends React.Component
{
	static propTypes =
	{
		sitekey : React.PropTypes.string.isRequired,
		handleRecaptchaDone : React.PropTypes.func.isRequired,
		handleRecaptchaExpire : React.PropTypes.func.isRequired,
		setWidgetId : React.PropTypes.func.isRequired
	};

	renderRecaptcha = () =>
	{
		const id = grecaptcha.render('recaptcha',
		{
		    'sitekey' : this.props.sitekey,
		    'callback' : this.props.handleRecaptchaDone,
		    'expired-callback' : this.props.handleRecaptchaExpire
		});
		this.props.setWidgetId(id);
	}

	componentDidMount()
	{
		if (typeof grecaptcha == 'undefined')
		{
			console.log('grecaptcha undefined');
			window['onloadCallback'] = () =>
			{
				this.renderRecaptcha();
			};
		}
		else
		{
			console.log('grecaptcha defined');
			this.renderRecaptcha();
		}
	}

	render()
	{
        return(
        	<div id='recaptcha'>
        	</div>
        );
	}
}