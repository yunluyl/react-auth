'use strict';
var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));
var Pitem = mongoose.model('Pitem');
var Usr2pla = mongoose.model('Usr2pla');
var message = require('../config').message;

//module.exports.createit = function(req, res)

module.exports.getit = function(req, res)
{
	Usr2pla.find({plan : req.body.planId, user : req.user._id}).lean().execAsync()
	.then(function(data)
	{
	    if (data.length === 1)
	    {
	        return Pitem.find({plan : req.body.planId}).lean().execAsync();
	    }
	    else
	    {
	        throw new Error(message.notPlanOwner);
	    }
	})
	.then(function(data)
	{
		if (data)
		{
			const sortedItems = data.sort(function(a,b)
			{
				if (a.day > 0 && b.day === 0)
				{
					return -1;
				}
				else if (a.day === 0 && b.day > 0)
				{
					return 1;
				}
				else if (a.day > b.day)
				{
					return 1;
				}
				else if (a.day < b.day)
				{
					return -1;
				}
				else if (a.day === 0 && b.day === 0)
				{
					return a.createdAt - b.createdAt;
				}
				else if (a.day === b.day)
				{
					if (a.time > b.time)
					{
						return 1;
					}
					else if (a.time < b.time)
					{
						return -1;
					}
					else
					{
						return a.createdAt - b.createdAt;
					}
				}
				else
				{
					return 0;
				}
			});
			res.status(200).send({items : sortedItems});
		}
		else
		{
			res.status(200).send({items : []});
		}
	})
	.catch(function(e)
    {
        res.status(500).send({err : e.message});
    });
}