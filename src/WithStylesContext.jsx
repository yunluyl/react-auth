'use strict';
import React from 'react';

export default class WithStylesContext extends React.Component
{
	static propTypes =
	{
		children : React.PropTypes.any.isRequired,
		onInsertCss : React.PropTypes.func.isRequired
	};

	static childContextTypes =
	{
		insertCss : React.PropTypes.func.isRequired
	};

	getChildContext()
	{
		return {insertCss : this.props.onInsertCss};
	}

	render()
	{
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}