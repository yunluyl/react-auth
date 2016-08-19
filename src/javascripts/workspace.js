$(document).ready(function() {
    var socket = io('https://travelplanserver.herokuapp.com', {secure : true});
    var $body = $('body');
    $body.html($body.html() + '<div id="12345"></div>');
    var username;
    var uuid = 0;
    var colors = ['black', 'yellow', 'blue', 'red'];
    var colorCnt = 0;
    
    var myPlan =
    {
        '12345' :
        {
            type : 'square',
            jqueryRef : $('#12345'),
            bgColor :
            {
                ioData :
                {
                    _id : '12345',
                    csu : 'bgColor',
                    uuid : 0,
                    sender : '',
                    value : 'red'
                },
                dirty : false
            },
            position :
            {
                ioData :
                {
                    _id : '12345',
                    csu : 'position',
                    uuid : 0,
                    sender : '',
                    value : {left : '200px', top : '200px'},
                },
                dirty : false
            }
        }
    };
    
    var $form1 = $('#form1');
    $form1.submit(function(event) {
        username = $form1.find('input[name="user"]').val();
        for (var key in myPlan['12345'])
        {
            if (myPlan['12345'].hasOwnProperty(key) && key !== 'type' && key !== 'jqueryRef')
            {
                myPlan['12345'][key].ioData.sender = username;
            }
        }
        event.preventDefault();
    });
    
    myPlan['12345'].jqueryRef.css({
        'background-color':'red',
        'height':'100px',
        'width':'100px',
        'position':'relative',
        'left':'200px',
        'top':'200px',
        'cursor':'default'
    });

    myPlan['12345'].jqueryRef.hover(function()
    {
        myPlan['12345'].jqueryRef.css('cursor','move');
    }, function()
    {
        myPlan['12345'].jqueryRef.css('cursor','default');
    });
    
    myPlan['12345'].jqueryRef.draggable({
        'containment':'domcument',
        'start':handleDragStart,
        'stop':handleDragStop
    }); 

    myPlan['12345'].jqueryRef.click(function()
    {
        myPlan['12345'].bgColor.dirty = true;
        myPlan['12345'].bgColor.ioData.value = colors[colorCnt];
        myPlan['12345'].jqueryRef.css('background-color', colors[colorCnt]);
        colorCnt >= 3 ? colorCnt = 0 : colorCnt++;
        sendIO(myPlan['12345'].bgColor.ioData);
    });
    
    function handleDragStart()
    {
        myPlan['12345'].position.dirty = true;
    }

    function handleDragStop()
    {
        myPlan['12345'].position.ioData.value.left = myPlan['12345'].jqueryRef.css('left');
        myPlan['12345'].position.ioData.value.top = myPlan['12345'].jqueryRef.css('top');
        sendIO(myPlan['12345'].position.ioData);
    }

    function sendIO(csua)
    {
        csua.uuid = uuid;
        uuid >= 20 ? uuid = 0 : uuid++;
        socket.emit('mo', csua);
    }

    //receiving code
    var receiveBuf = {};
    var suidExpect = -1;
    socket.on('connect', function()
    {
        console.log('connected!');
        receiveBuf = {};
        suidExpect = -1;
    });

    socket.on('disconnect', function()
    {
        console.log('disconnected!');
    });

    socket.on('mo', function(msg)
    {
        console.log(msg);
        if (suidExpect === -1 || suidExpect === msg.suid || msg.suid === 1)
        {
            applyMsg(msg);
            var bufMsg = receiveBuf[suidExpect.toString()];
            while(bufMsg)
            {
                delete receiveBuf[suidExpect.toString()];
                applyMsg(bufMsg);
                bufMsg = receiveBuf[suidExpect.toString()];
            }
        }
        else if (msg.suid > suidExpect)
        {
            receiveBuf[msg.suid.toString()] = msg;
            setTimeout(function()
            {
                if (msg.suid > suidExpect)
                {
                    console.log('Out of order mo packet timed out in buffer');
                    console.log('received suid is: ' + msg.suid);
                    console.log('suid expect is: ' + suidExpect);
                }
            }, 2000);
        }
        else
        {
            console.log('ERROR: msg.suid is smaller than suidExpect'); //need to reconnect and get data from database REVISIT
        }
    });

    function applyMsg(msg)
    {
         suidExpect = msg.suid + 1;
         if (myPlan['12345'][msg.csu].ioData.sender === msg.sender && myPlan['12345'][msg.csu].ioData.uuid === msg.uuid)
         {
             myPlan['12345'][msg.csu].dirty = false;
             myPlan['12345'][msg.csu].ioData.value = msg.value;
             updateObjectDisplay(msg);
         }
         else
         {
             if (myPlan['12345'][msg.csu].dirty == false)
             {
                 myPlan['12345'][msg.csu].ioData.value = msg.value;
                 updateObjectDisplay(msg);
             }
         }
    }

    function updateObjectDisplay(ioData)
    {
        switch (ioData.csu)
        {
            case 'position':
                myPlan['12345'].jqueryRef.css({
                    'left' : ioData.value.left,
                    'top' : ioData.value.top
                });
                break;
            case 'bgColor':
                myPlan['12345'].jqueryRef.css('background-color', ioData.value);
                break;
            default:
                console.log('csu attribute is unkown, cannot update object display');
        }
    }

    function suidLargerThan(id1, id2)
    {
        if (id1 === id2)
        {
            console.log('ERROR: the suids are equal');
        }
        else if (id1 > id2)
        {
            if (id1 - id2 > 50)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            if (id2 - id1 > 50)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
});
