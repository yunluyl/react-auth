var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));
var Plan = mongoose.model('Plan');
var Usr2pla = mongoose.model('Usr2pla');
var message = require('../config').message;

module.exports.createPlan = function(req, res)
{
    Plan.createAsync(new Plan(
    {
        name : req.body.name,
        start : req.body.start,
        end : req.body.end,
        users : [req.user._id]
    }))
    .then(function(data)
    {
        return Usr2pla.createAsync(new Usr2pla(
        {
            user : req.user._id,
            plan : data._id
        }));
    })
    .then(function(data)
    {
        res.status(200).json({redirect : '/plans/:'+data.plan});
    })
    .catch(function(e)
    {
        res.status(500).send({msg : e.message});
    });
}

module.exports.editPlan = function(req, res)
{
    let edit = {};
    const editKey = ['name', 'start', 'end'];
    editKey.map(function(key)
    {
        if (req.body.hasOwnProperty(key))
        {
            edit[key] = req.body[key];
        }
    });
    if (!edit)
    {
        res.status(500).send({err : message.noChangeInEditPlan});
    }
    Plan.updateAsync({_id : planId, users : req.user._id}, {$set : edit})
    .then(function(data)
    {
        if (data.nModified === 1)
        {
            res.status(200).json({});
        }
        else if (data.n === 1 && data.nModified === 0)
        {
            throw new Error(message.noChangeInEditPlan);
        }
        else
        {
            throw new Error(message.editPlanNotExist);
        }
    })
    .catch(function(e)
    {
        res.status(500).send({err : e.message});
    });
}

module.exports.getPlan = function(req, res)
{
    Usr2pla.find({user : req.user._id}, {plan : 1}).lean().execAsync()
    .then(function(data)
    {
        if (data.length > 0)
        {
            const planIds = data.map((link) =>
            {
                return link.plan;
            });
            Plan.find({_id : {$in : planIds}}).lean().execAsync()
            .then(function(data)
            {
                if (data)
                {
                    const sortedPlans = data.sort(function(a, b)
                    {
                        return b.ct - a.ct;
                    });
                    res.status(200).send({plans : sortedPlans});
                }
                else
                {
                    throw new Error(message.noPlanforLink);
                }
            });
        }
        else
        {
            res.status(200).send({plans : []});
        }
    })
    .catch(function(e)
    {
        res.status(500).send({err : e.message});
    });
}

module.exports.addup = function(req, res)
{
    Usr2pla.find({plan : req.body.planId, user : req.user._id}).lean().execAsync()
    .then(function(data)
    {
        if (data.length === 1)
        {
            var link =
            {
                plan : req.body.planId,
                user : req.body.userId
            };
            return Usr2pla.updateAsync(link, {$setOnInsert : link}, {upsert : true});
        }
        else
        {
            throw new Error(message.notPlanOwner);
        }
    })
    .then(function(data)
    {
        if (data.hasOwnProperty('upserted'))
        {
            res.status(200).send({});
        }
        else
        {
            throw new Error(message.u2pExist);
        }
    })
    .catch(function(e)
    {
        res.status(500).send({err : e.message});
    });
}

module.exports.removeup = function(req, res)
{
    Usr2pla.removeAsync({user : req.user._id, plan : req.body.planId})
    .then(function(data)
    {
        if (data.result.n === 1)
        {
            res.status(200).send({});
        }
        else if (data.result.n === 0)
        {
            throw new Error(message.removePlanNotExist);
        }
        else
        {
            throw new Error(message.removePlanTooMany);
        }
    })
    .catch(function(e)
    {
        res.status(500).send({err : e.message});
    });
}