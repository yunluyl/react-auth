var socketio = require('socket.io');
var redis = require('redis');
var socketioRedis = require('socket.io-redis');
var pub = redis.createClient(process.env.REDISCLOUD_URL);
var sub = redis.createClient(process.env.REDISCLOUD_URL, {return_buffers : true});
var suid = redis.createClient(process.env.REDISCLOUD_URL);
var io = module.exports.io = socketio();
var adapter = socketioRedis({key : 'tp', pubClient : pub, subClient : sub});
io.adapter(adapter);

//var count = 0; //test code
module.exports.onConnect = function(socket)
{
    console.log('user connected');
    const room = socket.request._query.planId;
    console.log('room is: '+room);
    socket.join(room);
    socket.on('disconnect', function()
    {
        console.log('user disconnected');
    });
    socket.on('mo', function(msg)
    {
        console.log(adapter.uid);
        suid.incr(room, function(err, reply)
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                console.log(typeof reply);
                msg.suid = reply;
                console.log(msg);
                io.to(room).emit('mo', JSON.stringify(msg));
            }
        });
        suid.expire(room, 604800, function(err, reply) {
            if (err)
            {
                console.log(err);
            }
            else
            {
                if (reply !== 1)
                {
                    console.log('ERROR: expire could not be set');
                }
            }
        });
        /*test code
        if (count === 0)
        {
            var rn = Math.floor(Math.random()*2 + 1);
            if (rn === 1)
            {
                count = 0;
            }
            else
            {
                count = 1;
            }
            if (suid.plan1 + rn > 100)
            {
                suid.plan1 = suid.plan1 + rn - 101;
            }
            else
            {
                suid.plan1 += rn;
            }
        }
        else if (count === 1)
        {
            count = 2;
            suid.plan1--;
        }
        else
        {
            suid.plan1++;
            var rn = Math.floor(Math.random()*2 + 1);
            if (rn === 1)
            {
                count = 0;
            }
            else
            {
                count = 1;
            }
            if (suid.plan1 + rn > 100)
            {
                suid.plan1 = suid.plan1 + rn - 101;
            }
            else
            {
                suid.plan1 += rn;
            }
        }
        */
    });
}
