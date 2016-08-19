'use strict';
import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './planCard.scss';

const PlanCard = (props) =>
{
	return (
		<div>
			<div className={cx(styles.planCard, styles.globalGreen)} onClick={props.handlePlanClick.bind(this, props.index)}>
        	    <div className={styles.name}>{props.name}</div>
        	    <div className={styles.date}>{props.start} - {props.end}</div>
        	</div>
        	<button type='button' onClick={props.handleRemovePlan.bind(this, props.index)}>
        		Remove Plan
        	</button>
        </div>
	);
}

PlanCard.propTypes =
{
	index : React.PropTypes.number.isRequired,
	name : React.PropTypes.string.isRequired,
	start : React.PropTypes.string.isRequired,
	end : React.PropTypes.string.isRequired,
	handlePlanClick : React.PropTypes.func.isRequired,
	handleRemovePlan : React.PropTypes.func.isRequired
}

export default withStyles(styles)(PlanCard);