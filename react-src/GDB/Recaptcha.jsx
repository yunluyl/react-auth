'use strict';
import React from 'react';

export default class Recaptcha extends React.Component
{
	static propTypes =
	{
		dorecaptcha : React.PropTypes.bool.isRequired,
		handleRecaptchaDone : React.PropTypes.func.isRequired,
		handleRecaptchaExpire : React.PropTypes.func.isRequired,
		setWidgetId : React.PropTypes.func.isRequired
	};

	componentWillMount()
	{
		this.recaptchaDisplayed = false;
	}

	renderRecaptcha = () =>
	{
		if (this.props.dorecaptcha && !this.recaptchaDisplayed)
    	{
    		const id = grecaptcha.render('recaptcha',
    		{
    		    'sitekey' : '6LeF6R4TAAAAAONP0EH3UOTa3MRyzCbSRbM8OCUk',
    		    'callback' : this.props.handleRecaptchaDone,
    		    'expired-callback' : this.props.handleRecaptchaExpire
    		});
    		this.props.setWidgetId(id);
    		this.recaptchaDisplayed = true;
    	}
	};

	render()
	{
		this.renderRecaptcha();
        return(
        	<div id='recaptcha'>
        	</div>
        );
	}
}