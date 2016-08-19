'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './marker.scss';

const Marker = (props) =>
{
	const divStyle =
	{
		left : props.pixels[0] - 25.57022603955158414669481207016163464282786458961580121961,
		top : props.pixels[1] - 25.57022603955158414669481207016163464282786458961580121961,
		borderStyle : 'solid',
    	borderWidth : '2px',
    	borderColor : '#fff',
    	borderRadius: '50%'
	};
	if (props.show)
	{
		divStyle.display = 'block';
	}
	else
	{
		divStyle.display = 'none';
	}
	let imageUrl;
	if (props.item.image[0])
	{
		imageUrl = props.item.image[0];
	}
	else
	{
		imageUrl = 'https://s3.amazonaws.com/travelplanserver/placeholder.jpg';
	}
	return (
		<div
			className = {styles.marker}
			style = {divStyle}
		>
			<img src={imageUrl} className={styles.markerImg} />
		</div>
	);
}

Marker.propTypes =
{
	show : React.PropTypes.bool.isRequired,
	pixels : React.PropTypes.array.isRequired,
	item : React.PropTypes.object.isRequired
};

export default withStyles(styles)(Marker);