'use strict';
import React from 'react';
import ChangeForm from './ChangeForm';
import apiReq from './apiReq';

class Change extends React.Component
{
	static defaultProps =
	{
		inReset : false
	};

	static propTypes =
	{
		authPath : React.PropTypes.string.isRequired
	};

	state =
	{
		oldPassword : '',
		newPassword : '',
		confirm : '',
		oldPasswordMsg : '',
		newPasswordMsg : '',
		confirmMsg : '',
		errorMsg : '',
		isChange : false
	};

	componentWillUnmount()
	{
	    this.setState(
	    {
	        oldPassword : '',
	        newPassword : '',
	        confirm : '',
	        oldPasswordMsg : '',
	        newPasswordMsg : '',
	        confirmMsg : '',
	        errorMsg : '',
	        isChange : false
	    });
	}

	changeStart = () =>
	{
	    this.setState({isChange : true});
	    if (typeof this.props.start !== 'undefined')
        {
            this.props.start();
        }
	};

	changeSuccess = (data) =>
	{
	    this.setState({isChange : false});
	    if (typeof this.props.success !== 'undefined')
        {
            this.props.success(data);
        }
	};

	changeFail = (err) =>
	{
	    this.setState({errorMsg : err.msg, isChange : false});
	    if (typeof this.props.fail !== 'undefined')
        {
            this.props.fail(err);
        }
	};

	handleOldPasswordChange = (e) =>
	{
		this.setState({oldPassword : e.target.value, errorMsg : ''});
	};

	handleNewPasswordChange = (e) =>
	{
		this.setState({newPassword : e.target.value, newPasswordMsg : '', errorMsg : ''});
	};

	handleConfirmChange = (e) =>
	{
		this.setState({confirm : e.target.value, confirmMsg : '', errorMsg : ''});
	};

	handleSubmit = (e) =>
	{
		e.preventDefault();
		let oldPassword = this.state.oldPassword.trim();
		let newPassword = this.state.newPassword.trim();
		let confirm = this.state.confirm.trim();
		let submitForm = true;
		let data = {};
		let clearInputs;

		if (this.props.inReset)
		{
			clearInputs =
			{
				newPassword : '',
				confirm : '',
				errorMsg : ''
			};
		}
		else
		{
			clearInputs =
			{
				oldPassword : '',
				newPassword : '',
				confirm : '',
				errorMsg : ''
			};
		}
		this.setState(clearInputs);
		
		//Check old password is correct
        if (oldPassword)
        {
            this.setState({oldPasswordMsg : ''});
        }
        else
        {
            submitForm = false;
            let msgTemp = this.props.inReset?'Secret token cannot be empty':'Old password cannot be empty';
            this.setState({oldPasswordMsg : msgTemp});
        }
		
		//Check new password is correct
		if (newPassword.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/))
		{
		    this.setState({newPasswordMsg : ''});
		}
		else if (newPassword)
		{
		    submitForm = false;
		    this.setState({newPasswordMsg : 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters'})
		}
		else
		{
		    submitForm = false;
		    this.setState({newPasswordMsg : 'Password is empty'});
		}
		//Check confirm password is correct
		if (newPassword !== confirm)
		{
		    submitForm = false;
		    this.setState({confirmMsg : 'Password and confirm password are not equal'});
		}
		else if (!confirm)
		{
		    submitForm = false;
		    this.setState({confirmMsg : 'Confirm password is empty'});
		}
		else
		{
		    this.setState({confirmMsg : ''});
		}
		data.pw = oldPassword;
        data.np = newPassword;
        if (this.props.inReset)
        {
        	data._id = this.props.userID;
        }
        if (submitForm)
        {
            apiReq(
                'POST',
                this.props.authPath + '/change',
                data,
                this.changeStart,
                this.changeSuccess,
                this.changeFail
            );
        }
	};

	render()
	{
		return (
			<ChangeForm
				change = {this.state}
				inReset = {this.props.inReset}
				changStyle = {this.props.changeConfig?this.props.changeConfig.style:{}}
				changeClass = {this.props.changeConfig?this.props.changeConfig.className:{}}
				handleOldPasswordChange = {this.handleOldPasswordChange}
				handleNewPasswordChange = {this.handleNewPasswordChange}
				handleConfirmChange = {this.handleConfirmChange}
				handleSubmit = {this.handleSubmit}
			/>
		);
	}
}

export default Change;