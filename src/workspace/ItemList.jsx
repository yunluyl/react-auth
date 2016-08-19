'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './itemList.scss';
import ItemCard from './ItemCard.jsx';

const ItemList = (props) =>
{
	const itemNodes = props.items.map((item, i) =>
	{
		let imageUrl;
		if (item.image[0])
		{
			imageUrl = item.image[0];
		}
		else
		{
			imageUrl = 'https://s3.amazonaws.com/travelplanserver/placeholder.jpg';
		}
		return (
			<ItemCard 
				key={item._id}
				index={i}
				image={imageUrl}
				title={item.title}
			/>
		);
	});
	return (
		<div className={styles.itemList}>
			{itemNodes}
		</div>
	);
};

ItemList.propTypes =
{
	items : React.PropTypes.array.isRequired
};

export default withStyles(styles)(ItemList);