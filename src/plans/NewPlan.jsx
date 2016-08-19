'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './newPlan.scss';

const NewPlan = (props) =>
{
	const displayForm = props.newplan.open ? styles.openForm : styles.closeForm;
	return (
		<form className={displayForm} onSubmit={props.handleNewplanSubmit}>
		    <input
		    	type='text'
		    	placeholder='Plan name'
		    	value={props.newplan.name}
		    	onChange={props.handleNameChange}
		    />
		    <div className={styles.nameMsg}>
		    	{props.newplan.nameMsg}
		    </div>
		    <br />
		    <input
		    	type='text'
		    	placeholder='Start date MM-DD-YYYY'
		    	value={props.newplan.start}
		    	onChange={props.handleStartChange}
		    />
		    <div className={styles.startMsg}>
		    	{props.newplan.startMsg}
		    </div>
		    <br />
		    <input
		    	type='text'
		    	placeholder='End date MM-DD-YYYY'
		    	value={props.newplan.end}
		    	onChange={props.handleEndChange}
		    />
		    <div className={styles.endMsg}>
		    	{props.newplan.endMsg}
		    </div>
		    <br />
		    <div className={styles.errorMsg}>
                {props.newplan.errorMsg}
            </div>
		    <input type='submit' value='Create' />
		</form>
	);
}

NewPlan.propTypes =
{
	newplan : React.PropTypes.object.isRequired,
	handleNewplanSubmit : React.PropTypes.func.isRequired,
	handleNameChange : React.PropTypes.func.isRequired,
	handleStartChange : React.PropTypes.func.isRequired,
	handleEndChange : React.PropTypes.func.isRequired
}

export default withStyles(styles)(NewPlan);