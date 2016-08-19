'use strict';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './routeLayer.scss';
import {dayColors, zoomToPoints, sidebarWidth} from '../constants.jsx';

class RouteLayer extends React.Component
{
	static propTypes =
	{
		map : React.PropTypes.object.isRequired,
		routeLine : React.PropTypes.object.isRequired,
		viewport : React.PropTypes.object.isRequired,
		initFlyDone : React.PropTypes.bool.isRequired,
		isGettingRouteLine : React.PropTypes.number.isRequired
	};

	componentWillMount()
	{
		//this.ratio = 1;
		this.initRenderDone = false;
		this.nextRoutes = [];
	}

	componentDidMount()
	{
		/*
		this.canvas = this.refs.routes;
		this.ctx = this.canvas.getContext('2d');
		*/
		/*
		const devicePixelRatio = window.devicePixelRatio || 1;
		const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
		                          this.ctx.mozBackingStorePixelRatio ||
		                          this.ctx.msBackingStorePixelRatio ||
		                          this.ctx.oBackingStorePixelRatio ||
		                          this.ctx.backingStorePixelRatio || 1;
		this.ratio = devicePixelRatio / backingStoreRatio;
		*/
	}

	componentWillUpdate()
	{
		/*
		const globPixel = Math.pow(2, this.props.viewport.zoom + 9);
		if (this.props.initFlyDone && this.props.isGettingRouteLine === 0 && this.props.routeChanged)
		{
			let routeDays = Object.keys(this.props.routeLine);
			routeDays.sort((a, b) =>
			{
				return Number(a) - Number(b);
			});
			for (let i = 0; i < routeDays.length; i++)
			{
				let pathd = '';
				const routeArrayLength = this.props.routeLine[routeDays[i]].length;
				for (let j = 0; j < routeArrayLength; j ++)
				{
					if (j > routeArrayLength - 1)
					{
						j = routeArrayLength - 1;
					}
					let pointPixel = this.props.map.project(this.props.routeLine[routeDays[i]][j]);
					pointPixel.x = pointPixel.x % globPixel;
					if (pointPixel.x < 0)
					{
						pointPixel.x += globPixel;
					}
					
					if ((pointPixel.x * 2 + globPixel) / 2 <
						(this.props.viewport.width - sidebarWidth) / 2 + sidebarWidth)
					{
						pointPixel.x += globPixel;
					}
					if (j === 0)
					{
						pathd += 'M ' + pointPixel.x + ' ' + pointPixel.y;
					}
					else
					{
						pathd += ' L ' + pointPixel.x + ' ' + pointPixel.y;
					}
					
				}
				this.nextRoutes.push(
					<path
						d = {pathd}
						stroke = {dayColors[i]}
					/>
				);
			}
		}
		*/
	}

	componentDidUpdate()
	{
		//this.drawLine();
	}

/*
	drawLine = () =>
	{
		//this.ctx.save();
		//this.ctx.scale(this.ratio, this.ratio);
		//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.save();
		let routeDays = Object.keys(this.props.routeLine);
		routeDays.sort((a, b) =>
		{
			return Number(a) - Number(b);
		});
		for (let i = 0; i < routeDays.length; i++)
		{
			this.ctx.beginPath();
			let pointPixel = this.props.map.project(this.props.routeLine[routeDays[i]][0]);
			this.ctx.moveTo(pointPixel.x, pointPixel.y);
			const routeArrayLength = this.props.routeLine[routeDays[i]].length;
			for (let j = 1; j < routeArrayLength; j ++)
			{
				if (j >= routeArrayLength)
				{
					j = routeArrayLength - 1;
				}
				pointPixel = this.props.map.project(this.props.routeLine[routeDays[i]][j]);
				if (pointPixel.x > -10
					&& pointPixel.y > -10
					&& pointPixel.x < this.props.viewport.width + 10
					&& pointPixel.y < this.props.viewport.height + 10)
				{
					this.ctx.lineTo(pointPixel.x, pointPixel.y);
				}
			}
			this.ctx.lineWidth = 5;
			this.ctx.strokeStyle = dayColors[i];
			this.ctx.stroke();
			this.ctx.restore();
		}
		
	};
*/
	pointInViewPort = (pointPixel) =>
	{
		return pointPixel.x > -10 + sidebarWidth
			&& pointPixel.y > -10
			&& pointPixel.x < this.props.viewport.width + 10
			&& pointPixel.y < this.props.viewport.height + 10;
	};

	render()
	{
		/*
		const canvasSize =
		{
			width : this.props.viewport.width + 'px',
			height : this.props.viewport.height + 'px'
		};
		*/
		//if (!this.initRenderDone)



/*

			const zoom = Math.round(this.props.viewport.zoom * 2) / 2;
			let k;
			if (zoom >= 11.5)
			{
				k = 1;
			}
			else
			{
				k = Math.round(Math.pow(2, (11.5 - zoom)));
			}
			const globPixel = Math.pow(2, this.props.viewport.zoom + 9);
			for (let i = 0; i < routeDays.length; i++)
			{
				let pathd = [];
				let previousInViewport;
				let pathIdx = 0;
				let previousPathIdx = -1;
				const routeArrayLength = this.props.routeLine[routeDays[i]].length;
				for (let j = 0; j < routeArrayLength; j += k)
				{
					if (j >= routeArrayLength)
					{
						j = routeArrayLength - 1;
					}
					let pointPixel = this.props.map.project(this.props.routeLine[routeDays[i]][j]);
					pointPixel.x = pointPixel.x % globPixel;
					if (pointPixel.x < 0)
					{
						pointPixel.x += globPixel;
					}
					
					if ((pointPixel.x * 2 + globPixel) / 2 <
						(this.props.viewport.width - sidebarWidth) / 2 + sidebarWidth)
					{
						pointPixel.x += globPixel;
					}
					
					const inViewPort = this.pointInViewPort(pointPixel);
					if (j > 0)
					{
						previousPathIdx = pathIdx;
						if (previousInViewport && inViewPort)
						{
							pathd[pathIdx] += ' L ' + pointPixel.x + ' ' + pointPixel.y;
						}
						else if (previousInViewport && !inViewPort)
						{
							pathd[pathIdx] += ' L ' + pointPixel.x + ' ' + pointPixel.y;
							pathIdx++;
						}
						else if (!previousInViewport && inViewPort)
						{
							pathd.push('');
							const previousPointPixel = this.props.map.project(this.props.routeLine[routeDays[i]][j - k]);
							pathd[pathIdx] += 'M ' + previousPointPixel.x + ' ' + previousPointPixel.y
											  ' L ' + pointPixel.x + ' ' + pointPixel.y;
						}
						previousInViewport = inViewPort;
					}
					else
					{
						previousPathIdx = pathIdx;
						if (inViewPort)
						{
							pathd.push('');
							pathd[pathIdx] += 'M ' + pointPixel.x + ' ' + pointPixel.y;
							previousInViewport = true;
						}
						else
						{
							previousInViewport = false;
						}
					}
					
				}
				for (let m = 0; m < pathd.length; m++)
				{
					nextRoutes.push(
						<path
							d = {pathd[m]}
							stroke = {dayColors[i]}
						/>
					);
				}
			}
			*/

		return (
			
			<div className={styles.routes}>
				<svg
					width='100%'
					height='100%'
				>
					<g
						fill = 'none'
						strokeWidth = '6'
						strokeLinecap = 'round'
						strokeLinejoin = 'round'
					>
						{this.nextRoutes}
					</g>
				</svg>
			</div>
			
			/*
			<canvas
				className = {styles.routes}
				ref = 'routes'
				width = {this.props.viewport.width}
				height = {this.props.viewport.height}
			/>
			*/
		);
	}
}

export default withStyles(styles)(RouteLayer);