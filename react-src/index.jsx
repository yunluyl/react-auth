'use strict';
import React from 'react';
import {Link} from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './index.scss';

var Index = React.createClass(
{
	render : function()
	{
		return (
			<div>
				<div className={styles.login}>
					<Link to='/login'>Login</Link>
				</div>
				<div className={styles.signup}>
					<Link to='/signup'>Signup</Link>
				</div>
			</div>
		);
	}
});

export default withStyles(styles)(Index);