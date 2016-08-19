'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import WithStylesContext from '../WithStylesContext.jsx';
import * as action from './workActions.jsx';
import styles from './mapBox.scss';
import {sidebarWidth, dayColors} from '../constants.jsx';

class MapBox extends React.Component
{
	static propTypes =
	{
		items : React.PropTypes.array.isRequired,
		viewport : React.PropTypes.object.isRequired,
		serverRender : React.PropTypes.bool.isRequired,
		isGettingItem : React.PropTypes.bool.isRequired,
		initFlyDone : React.PropTypes.bool.isRequired,
		isDragging : React.PropTypes.bool.isRequired,
		routeLine : React.PropTypes.object.isRequired,
		isGettingRouteLine : React.PropTypes.number.isRequired,
		routeChanged : React.PropTypes.bool.isRequired,
		mapLoaded : React.PropTypes.bool.isRequired,
		dispatch : React.PropTypes.func.isRequired
	};

	handleInitFlyDone = () =>
	{
		this.props.dispatch(action.initFlyDone());
	};

	handleMouseDown = (e) =>
	{
		//this.inertiaBuffer.push([Date.now(), [e.point.x, e.point.y]])
		this.props.dispatch(action.mouseDown());
	};

	handleMouseUp = (e) =>
	{
	/*
		this.drainInertiaBuffer();
		if (this.inertiaBuffer.length < 2)
		{
			this.duration = 0;
			this.offset = [0, 0];
		}
		else
		{
			const last = this.inertiaBuffer[this.inertiaBuffer.length - 1];
			const first = this.inertiaBuffer[0];
			const flingOffset = [last[1][0] - first[1][0], last[1][1] - first[1][1]];
			const flingDuration = (last[0] - first[0]) / 1000;
			if (flingDuration === 0 || (flingOffset[0] === 0 && flingOffset[1] === 0))
			{
				this.duration = 0;
				this.offset = [0, 0];
			}
			else
			{
				const inertiaLinearity = 0.3;
				const inertiaMaxSpeed = 1400; // px/s
				const inertiaDeceleration = 2500; // px/s^2
				let velocity = [
					flingOffset[0] * (inertiaLinearity / flingDuration),
					flingOffset[1] * (inertiaLinearity / flingDuration)
				];
				let speed = Math.sqrt(Math.pow(velocity[0], 2) + Math.pow(velocity[1], 2));
				if (speed > inertiaMaxSpeed)
				{
					velocity = [
						velocity[0] * (inertiaMaxSpeed / speed),
						velocity[1] * (inertiaMaxSpeed / speed)
					];
					speed = inertiaMaxSpeed;
				}
				this.duration = speed / (inertiaDeceleration * inertiaLinearity);
				console.log('duration: ' + this.duration * 1000);
				this.offset = [
					velocity[0] * (-this.duration / 2),
					velocity[1] * (-this.duration / 2)
				];
				this.inertiaStartTime = Date.now();
				this.inertiaStartLng = this.props.viewport.lng;
				this.inertiaStartLat = this.props.viewport.lat;
				this.inertiaCount = 0;
			}
		}
		*/
		this.props.dispatch(action.mouseUp());
		if (this.dragged)
		{
			this.map.stop();
			this.dragged = false;
		}
	};

	handleDragStart = (e) =>
	{
		this.dragged = true;
		//this.drainInertiaBuffer();
		//this.inertiaBuffer.push([Date.now(), [e.originalEvent.x, e.originalEvent.y]]);
	};

	handleResize = (e) =>
	{
		this.handleViewportChange();
	};

	handleViewportChange = () =>
	{
		const lnglat = this.map.getCenter();
		const viewport =
		{
			width : window.innerWidth,
			height : window.innerHeight,
			lng : lnglat.lng,
			lat : lnglat.lat,
			zoom : this.map.getZoom()
		};
		this.props.dispatch(action.setViewport(viewport));
	};

	updateViewPort = (e) =>
	{
		/*
		const timeNow = Date.now();
		let lnglat = {};
		if (this.props.isInertia)
		{
			const bezier = new UnitBezier(0, 0, 0.3, 1);
			console.log(timeNow - this.inertiaStartTime);
			const pixelInertia = [
				this.offset[0] * (bezier.solve((timeNow - this.inertiaStartTime) / (this.duration * 1000))),
				this.offset[1] * (bezier.solve((timeNow - this.inertiaStartTime) / (this.duration * 1000)))
			];
			this.inertiaCount++;
			lnglat.lng = this.inertiaStartLng + (360 * pixelInertia[0]) / Math.pow(2, this.props.viewport.zoom + 9);
			lnglat.lat = this.inertiaStartLat - (180 * pixelInertia[1]) / Math.pow(2, this.props.viewport.zoom + 8.3);
		}
		else
		{
		*/
		const lnglat = this.map.getCenter();
		const viewport =
		{
			width : window.innerWidth,
			height : window.innerHeight,
			lng : lnglat.lng,
			lat : lnglat.lat,
			zoom : this.map.getZoom()
		};
		this.props.dispatch(action.setViewport(viewport));
	};
/*
	drainInertiaBuffer = () =>
	{
		const now = Date.now();
		const cutoff = 160;

		while (this.inertiaBuffer.length > 0 && now - this.inertiaBuffer[0][0] > cutoff)
		{
			this.inertiaBuffer.shift();
		}
	};
*/
/*
	dragPan = (e) =>
	{
		if (this.props.isDragging)
		{
			if (this.lastIsDragging)
			{
				this.map.panBy(
					[this.point.x - e.point.x, this.point.y - e.point.y],
					{animate : false}
				);
				this.point = {x : e.point.x, y : e.point.y};
			}
			else
			{
				this.point = {x : e.point.x, y : e.point.y};
			}
		}
		this.lastIsDragging = this.props.isDragging;
	}
*/

	componentWillMount()
	{
		this.dragged = false;
	}

	componentDidMount()
	{
		mapboxgl.accessToken = 'pk.eyJ1IjoibHV5dW4xOTg5OTMiLCJhIjoiY2lwanczdmVnMDF6NHRlbTQ0dHdkemJ3ZCJ9.jmWyDcYef7dh8fxuXP3nZg';
		this.map = new mapboxgl.Map(
		{
			container : 'map',
			style : 'mapbox://styles/mapbox/outdoors-v9',
			zoom : 0,
			minZoom : 2,
			dragRotate : false,
			dragPan : true,
			keyboard : false
		});
		this.updateViewPort();
		const lnglatInit = this.map.getCenter();
		const viewport =
		{
			width : window.innerWidth,
			height : window.innerHeight,
			lng : lnglatInit.lng,
			lat : lnglatInit.lat,
			zoom : this.map.getZoom() 
		};
		this.handleViewportChange(viewport);
		window.addEventListener('resize', this.handleResize);
		this.map.on('move', this.updateViewPort);
		this.map.addControl(new mapboxgl.Navigation({position : 'bottom-right'}));
		//test
		this.map.on('mousedown', this.handleMouseDown);
		window.addEventListener('mouseup', this.handleMouseUp);
		//this.map.on('mousemove', this.dragPan);
		this.map.on('dragstart', this.handleDragStart);
		this.map.on('load', (e) =>
		{
			this.props.dispatch(action.mapLoad());
		});

	}

	componentWillUnmount()
	{
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('mouseup', this.handleMouseUp);
		if (this.map)
		{
			this.map.remove();
		}
	}

	componentWillUpdate(nextProps)
	{
		//initial location and zoom level setup
		if (!nextProps.isGettingItem && !nextProps.initFlyDone)
		{
			const items = nextProps.items;
			let zoom;
			let loc;
			let lngdiff;
			let latdiff;
			let width;
			let height;
			let lngZoom;
			let latZoom;
			let addrNum = 0;
			let markers = [];
			let lng = 0;
			let lat = 0;
			let maxlng = -180;
			let minlng = 180;
			let maxlat = -90;
			let minlat = 90;
			for (let i=0;i<items.length;i++)
			{
				if (items[i].loc)
				{
					addrNum++;
					lng += items[i].loc[0];
					lat += items[i].loc[1];
					if (items[i].loc[0] > maxlng)
					{
						maxlng = items[i].loc[0];
					}
					if (items[i].loc[0] < minlng)
					{
						minlng = items[i].loc[0];
					}
					if (items[i].loc[1] > maxlat)
					{
						maxlat = items[i].loc[1];
					}
					if (items[i].loc[1] < minlat)
					{
						minlat = items[i].loc[1];
					}
				}
				else
				{
					continue;
				}
			}
			if (addrNum === 0)
			{
				loc = [0, 0];
				zoom = 0;
			}
			else if (addrNum === 1)
			{
				loc = [lng, lat];
				zoom = 10;
			}
			else
			{
				loc = [lng/addrNum, lat/addrNum];
				lngdiff = maxlng - minlng;
				latdiff = maxlat - minlat;
				width = nextProps.viewport.width - sidebarWidth;
				height = nextProps.viewport.height;
				lngZoom = Math.log2(360*width/lngdiff) - 9;
				latZoom = Math.log2(180*height/latdiff) - 8.3;
				zoom = Math.min(lngZoom - 0.5, latZoom - 0.5);
				loc[0] -= (360*(sidebarWidth/2))/Math.pow(2, (zoom + 9));
			}
			this.map.jumpTo({center : loc, zoom : zoom});
			this.handleInitFlyDone();
		}
	}

	render()
	{
		if (
			   this.props.initFlyDone
			&& this.props.isGettingRouteLine === 0
			&& this.props.routeChanged
			&& this.props.mapLoaded
		)
		{
			let routeDays = Object.keys(this.props.routeLine);
			routeDays.sort((a, b) =>
			{
				return Number(a) - Number(b);
			});
			for (let i = 0; i < routeDays.length; i++)
			{
				this.map.addSource('route' + i,
				{
					type : 'geojson',
					data :
					{
						type : 'Feature',
						properties : {},
						geometry :
						{
							type : 'LineString',
							coordinates : this.props.routeLine[routeDays[i]]
						}
					}
				});

				this.map.addLayer(
				{
					id : 'layer' + i,
					type : 'line',
					source : 'route' + i,
					layout :
					{
						'line-join' : 'round',
						'line-cap' : 'round'
					},
					paint :
					{
						'line-color' : dayColors[i],
						'line-width' : 5
					}
				});
			}
			this.props.dispatch(action.applyRoute());
		}
		const childrenWithProps = React.Children.map(this.props.children, (child) =>
		{
			return React.cloneElement(child, {map : this.map, pixelInertia : this.pixelInertia});
		});
		return (
			<div className={styles.wrapper}>
				<div id='map' className={styles.map} />
				<div id='overlays' className={styles.overlays}>
					{childrenWithProps}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(MapBox);