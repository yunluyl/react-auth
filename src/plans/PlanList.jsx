'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './planList.scss';
import PlanCard from './PlanCard.jsx';

const PlanList = (props) =>
{
	const planNodes = props.planli.plans.map((plan, i) =>
	{
		return (
			<PlanCard
				key={plan._id}
				index={i}
				name={plan.name}
				start={plan.start}
				end={plan.end}
				handlePlanClick={props.handlePlanClick}
				handleRemovePlan={props.handleRemovePlan}
			/>
		);
	});
    return (
    	<div>
        	<div className={styles.planList}>
        	    {planNodes}
        	</div>
        	<div className={styles.createPlan} onClick={props.handleOpenCreatePlan}>
        		Create Plan
        	</div>
        </div>
    );
}

PlanList.propTypes =
{
	planli : React.PropTypes.object.isRequired,
	handlePlanClick : React.PropTypes.func.isRequired,
	handleOpenCreatePlan : React.PropTypes.func.isRequired,
	handleRemovePlan : React.PropTypes.func.isRequired
}

export default withStyles(styles)(PlanList);