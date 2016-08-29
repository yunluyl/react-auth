'use strict';
import React from 'react';

const ChangeForm = (props) =>
{
	return (
		<form
			className = {props.changeClass?props.changeClass.form:''}
			style = {props.changeStyle?props.changeStyle.form:props.changeClass?{}:{}}
			onSubmit = {props.handleSubmit}
		>
			<input
				className = {props.changeClass?props.changeClass.oldPwBox:''}
				style = {props.changeStyle?props.changeStyle.oldPwBox:props.changeClass?{}:{}}
				type = {props.inReset?'password':'text'}
				placeholder = {props.inReset?'Secret token':'Old password'}
				value = {props.change.oldPassword}
				onChange = {props.handleOldPasswordChange}
			/>
			<div
				className = {props.changeClass?props.changeClass.oldPwError:''}
				style = {props.changeStyle?props.changeStyle.oldPwError:props.changeClass?{}:{}}
			>
				{props.change.oldPasswordMsg}
			</div>
			<input
				className = {props.changeClass?props.changeClass.newPwBox:''}
				style = {props.changeStyle?props.changeStyle.newPwBox:props.changeClass?{}:{}}
				type = 'password'
				placeholder = 'New password'
				value = {props.change.newPassword}
				onChange = {props.handleNewPasswordChange}
			/>
			<div
				className = {props.changeClass?props.changeClass.newPwError:''}
				style = {props.changeStyle?props.changeStyle.newPwError:props.changeClass?{}:{}}
			>
				{props.change.newPasswordMsg}
			</div>
			<input
				className = {props.changeClass?props.changeClass.confirmBox:''}
				style = {props.changeStyle?props.changeStyle.confirmBox:props.changeClass?{}:{}}
				type = 'password'
				placeholder = 'Confirm new password'
				value = {props.change.confirm}
				onChange = {props.handleConfirmChange}
			/>
			<div
				className = {props.changeClass?props.changeClass.confirmError:''}
				style = {props.changeStyle?props.changeStyle.confirmError:props.changeClass?{}:{}}
			>
				{props.change.confirmMsg}
			</div>
			<div
				className = {props.changeClass?props.changeClass.errorMessage:''}
				style = {props.changeStyle?props.changeStyle.errorMessage:props.changeClass?{}:{}}
			>
				{props.change.errorMsg}
			</div>
			<input type = 'submit' value = 'Submit' />
		</form>
	);
}

ChangeForm.propTypes =
{
	change : React.PropTypes.object.isRequired,
	inReset : React.PropTypes.bool.isRequired,
	handleOldPasswordChange : React.PropTypes.func.isRequired,
	handleNewPasswordChange : React.PropTypes.func.isRequired,
	handleConfirmChange : React.PropTypes.func.isRequired,
	handleSubmit : React.PropTypes.func.isRequired
};

export default ChangeForm;