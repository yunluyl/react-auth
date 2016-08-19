'use strict';
import React from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import * as action from './workActions.jsx';
import {mountData} from '../redux/actionDefines.jsx';

//test
import ItemList from './ItemList.jsx';
import MapBox from './MapBox.jsx';
import MarkerLayer from './MarkerLayer.jsx';
import RouteLayer from './RouteLayer.jsx';

class WorkContainer extends React.Component
{

	static fetchData(data, cookie)
	{
		return action.getItem(data, cookie);
	}

	componentWillMount()
	{
		this.hasInitRouteLines = false;
	}

	componentWillUnmount()
    {
        this.props.dispatch(action.reset());
    }

	componentDidMount()
	{
		/*
		mapboxgl.accessToken = 'pk.eyJ1IjoibHV5dW4xOTg5OTMiLCJhIjoiY2lwanczdmVnMDF6NHRlbTQ0dHdkemJ3ZCJ9.jmWyDcYef7dh8fxuXP3nZg';
		const map = new mapboxgl.Map(
		{
			container : 'map',
			style : 'mapbox://styles/mapbox/outdoors-v9'
		});
		*/
		console.log('WorkContainer did mount');
		const url = window.location.href;
		const idIdx = url.search(/[/][:]/);
		const planId = url.slice(idIdx+2);
		mountData(this.props.dispatch, this.props.serverRender, action.getItem, {planId : planId});
		this.props.dispatch(action.setPlanId(planId));
		const socket = io('https://localhost:3000',
						{
							secure : true,
							query : 'planId='+planId
						});
		socket.on('connect', () =>
		{
			console.log('socket connected!');
		});
		socket.on('disconnect', () =>
		{
			console.log('socket disconnected!');
		});
		this.props.dispatch(action.getAllRouteLines(this.props.work.items));
	}

	componentDidUpdate()
	{
		if (!this.props.work.isGettingItem && !this.hasInitRouteLines)
		{
			console.log('get routes');
			this.props.dispatch(action.getAllRouteLines(this.props.work.items));
			this.hasInitRouteLines = true;
		}
	}

	render()
	{
		return (
			<div>
				<ItemList
					items = {this.props.work.items}
				/>
				<MapBox
					items = {this.props.work.items}
					viewport = {this.props.work.viewport}
					serverRender = {this.props.work.serverRender}
					initFlyDone = {this.props.work.initFlyDone}
					isGettingItem = {this.props.work.isGettingItem}
					isDragging = {this.props.work.isDragging}
					routeLine = {this.props.work.routeLine}
					isGettingRouteLine = {this.props.work.isGettingRouteLine}
					routeChanged = {this.props.work.routeChanged}
					mapLoaded = {this.props.work.mapLoaded}
					dispatch = {this.props.dispatch}
				>
				{/*}
					<RouteLayer
						routeLine = {this.props.work.routeLine}
						viewport = {this.props.work.viewport}
						initFlyDone = {this.props.work.initFlyDone}
						isGettingRouteLine = {this.props.work.isGettingRouteLine}
					/>
				*/}
					<MarkerLayer
						items = {this.props.work.items}
						viewport = {this.props.work.viewport}
						initFlyDone = {this.props.work.initFlyDone}
						mapLoaded = {this.props.work.mapLoaded}
					/>
				</MapBox>
			</div>
		);
	}
}

const mapState = (state) =>
{
	return {
		serverRender : state.serverReducer.serverRender,
		work : state.workReducer
	};
}

export default connect(mapState)(WorkContainer);