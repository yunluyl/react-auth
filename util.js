var config = require('./config');
var querystring = require('querystring');
var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));
var ReqList = mongoose.model('ReqList');

////Utility functions
//database access for recording number of requests
module.exports.reqLimit = function(req, res)
{
    return new promise(function(resolve, reject)
    {
        ReqList.find({$or : [{_id : req.body._id}, {_id : req.ip}]}).lean().execAsync()
        .then(function(data)
        {
            switch (data.length)
            {
                case 0:
                    ReqList.createAsync([{_id : req.body._id, fq : 1}, {_id : req.ip, fq : 1}])
                    .then(function(data)
                    {
                        resolve();
                    })
                    .catch(function(e)
                    {
                        reject(new Error('putItem'));
                    });
                    break;
                case 1:
                    if (data[0]._id === req.ip)
                    {
                        if (data[0].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                        promise.join(
                            ReqList.updateAsync({_id : req.ip}, {$inc : {fq : 1}}),
                            ReqList.createAsync({_id : req.body._id, fq : 1}),
                            function(data1, data2)
                            {
                                if (data1.nModified !== 1)
                                {
                                    throw new Error();
                                }
                                else
                                {
                                    resolve();
                                }
                            }
                        )
                        .catch(function(e)
                        {
                            reject(new Error('putItem'));
                        });
                    }
                    else if (data[0]._id === req.body._id)
                    {
                        if (data[0].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        promise.join(
                            ReqList.updateAsync({_id : req.body._id}, {$inc : {fq : 1}}),
                            ReqList.createAsync({_id : req.ip, fq : 1}),
                            function(data1, data2)
                            {
                                if (data1.nModified !== 1)
                                {
                                    throw new Error();
                                }
                                else
                                {
                                    resolve();
                                }
                            }
                        )
                        .catch(function(e)
                        {
                            reject(new Error('putItem'));
                        });
                    }
                    else
                    {
                        reject(new Error('getItem'));
                    }
                    break;
                case 2:
                    if (data[0]._id === req.body._id && data[1]._id === req.ip)
                    {
                        if (data[0].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        if (data[1].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                    }
                    else if (data[0]._id === req.ip && data[1]._id === req.body._id)
                    {
                        if (data[1].fq >= config.maxReqFromSameUser)
                        {
                            reject(new Error('tooManyRequestUser'));
                        }
                        if (data[0].fq >= config.maxReqFromSameIP)
                        {
                            reject(new Error('tooManyRequestIP'));
                        }
                    }
                    else
                    {
                        reject(new Error('editItem'));
                    }
                    ReqList.updateAsync({$or : [{_id : req.body._id},{_id : req.ip}]}, {$inc : {fq : 1}}, {multi : true})
                    .then(function(data)
                    {
                        if (data.nModified !== 2)
                        {
                            throw new Error();
                        }
                        else
                        {
                            resolve();
                        }
                    })
                    .catch(function(e)
                    {
                        reject(new Error('editItem'));
                    });
                    break;
                default:
                    reject(new Error('getItem'));
            }
        })
        .catch(function(e)
        {
            reject(new Error('getItem'));
        })
    });
}

//error report function
module.exports.reportErr = function(res, errorName)
{
    var message;
    var statusCode;
    if (typeof config.message[errorName] == 'undefined')
    {
        message = errorName;
        statusCode = 500;
    }
    else
    {
        message = config.message[errorName].msg;
        statusCode = config.message[errorName].status;
    }
    return res.status(statusCode).send({err : errorName, msg : message});
}

//verify the recaptcha value submitted by the user is correct
module.exports.verifyCaptcha = function(req)
{
    return new promise(function(resolve, reject)
    {
        var post_data = querystring.stringify
        ({
            secret : process.env.RECAPTCHA_KEY,
            response : req.body['g-recaptcha-response'],
            remoteip : req.ip
        });
        var post_options =
        {
            host : 'www.google.com',
            path : '/recaptcha/api/siteverify',
            method : 'POST',
            headers :
            {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(post_data)
            }
        }
        var post_req = https.request(post_options, function(res)
        {
            res.setEncoding('utf8');
            res.on('data', function(chunk)
            {
                resolve(chunk);
            });
            res.on('error', function(error)
            {
                reject(new Error(error));
            });
        });
        post_req.write(post_data);
        post_req.end();
    });
}