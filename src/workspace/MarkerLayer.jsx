'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './markerLayer.scss';
import Marker from './Marker.jsx';
import {sidebarWidth} from '../constants.jsx';

class MarkerLayer extends React.Component
{
	static propTypes =
	{
		map : React.PropTypes.object.isRequired,
		items : React.PropTypes.array.isRequired,
		viewport : React.PropTypes.object.isRequired,
		initFlyDone : React.PropTypes.bool.isRequired,
		mapLoaded : React.PropTypes.bool.isRequired
	};

	render()
	{
		const viewport = this.props.viewport;
		const items = this.props.items;
		let markers = [];
		let markerPosition = [];
		const globPixel = Math.pow(2, viewport.zoom + 9);
		if (this.props.initFlyDone && this.props.mapLoaded)
		{
			for (let i=0;i<items.length;i++)
			{
				if (items[i].loc)
				{
					const lnglat = items[i].loc;
					let showMarker = true;
					//mercator.project(lnglat);
					//this.props.map.project(lnglat)
					const pointPixel = this.props.map.project(lnglat);
					const pixels = [pointPixel.x, pointPixel.y];
					pixels[0] = pixels[0] % globPixel;
					if (pixels[0] < 0)
					{
						pixels[0] += globPixel;
					}
					if ((pixels[0] * 2 + globPixel) / 2 <
						(viewport.width - sidebarWidth) / 2 + sidebarWidth)
					{
						pixels[0] += globPixel;
					}
					if (pixels[0] < sidebarWidth - 50 || pixels[0] > viewport.width + 50
						|| pixels[1] < -50 || pixels[1] > viewport.height + 50)
					{
						showMarker = false;
					}
					for (let i = 0; i < markerPosition.length; i++)
					{
						if (Math.pow((pixels[0] - markerPosition[i][0]), 2)
							+ Math.pow((pixels[1] - markerPosition[i][1]), 2)
							< 100)
						{
							showMarker = false;
							break;
						}
					}
					if (showMarker)
					{
						markerPosition.push(pixels);
					}
					markers.unshift(
						<Marker
							show = {showMarker}
							pixels = {pixels}
							item = {items[i]}
						/>
					);
				}
				else
				{
					continue;
				}
			}
		}
		return (
			<div className={styles.markerLayer}>
				{markers}
			</div>
		);
	}
}

export default withStyles(styles)(MarkerLayer);