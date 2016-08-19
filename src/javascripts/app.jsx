'use strict';
let isNode = typeof module !== 'undefined' && module.exports;
import React from 'react';
import render from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';

class PlanBox extends React.Component
{
    componentDidMount()
    {
        //get data from server
    }
    render()
    {
        var planNodes = this.props.plans.map(function(plan)
        {
            return (
                <PlanCard key={plan._id} name={plan.name} start={plan.start} end={plan.end} />
            );
        });
        return (
            <div className='planBox'>
                {planNodes}
            </div>
        );
    }
}

class PlanCard extends React.Component
{
    render()
    {
        return (
            <div className='planCard'>
                <h3>{this.props.name}</h3>
                <p>{this.props.start} - {this.props.end}</p>
            </div>
        );
    }
}

class NewplanForm extends React.Component
{
    getInitialState()
    {
        return {name : '', start : '', end : ''};
    }
    handleNameChange(e)
    {
        this.setState({name : e.target.value});
    }
    handleStartChange(e)
    {
        this.setState({start : e.target.value});
    }
    handleEndChange(e)
    {
        this.setState({end : e.target.value});
    }
    render()
    {
        return (
            <form className='newplanform'>
                <input type='text' placeholder='Plan name' value={this.state.name} onChange={this.handleNameChange} /><br />
                <input type='text' placeholder='Start date MM-DD-YYYY'  value={this.state.start} onChange={this.handleStartChange} /><br />
                <input type='text' placeholder='End date MM-DD-YYYY'  value={this.state.end} onChange={this.handleEndChange} /><br />
                <input type='submit' value='Post' />
            </form>
        );
    }
}

let plans =
    [
        {
            _id : 'sdfhsdkjhf',
            name : 'San Jose',
            start : '2016-12-01',
            end : '2016-12-03'
        },
        {
            _id : 'f3784fdiufh',
            name : 'Austin',
            start : '2014-02-03',
            end : '2014-02-05'
        }
    ];

if (isNode)
{
    exports.PlanBox = PlanBox;
}
else
{
    render(
        <Router>
            <Route path='/' component={PlanBox} />
        </Router>
        <PlanBox plans={plans}/>,
        document.getElementById('root')
    );
}
