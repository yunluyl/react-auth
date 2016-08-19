'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './itemCard.scss';

const ItemCard = (props) =>
{
	return (
		<div className={styles.itemCard}>
			<img className={styles.itemImage} src={props.image} alt='broken url'/>
			<div className={styles.itemTitle}>
				{props.title}
			</div>
		</div>
	);
};

ItemCard.propTypes =
{
	image : React.PropTypes.string.isRequired,
	title : React.PropTypes.string.isRequired
};

export default withStyles(styles)(ItemCard);