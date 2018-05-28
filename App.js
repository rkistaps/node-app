var express = require('express');
var fs = require('fs');

module.exports = {

    chatSockets: {},

    init: function(config)
    {

        this.config = config;

        // write pid file
        fs.writeFileSync(__dirname + '/app.pid', process.pid);

        // requiring helper functions
        this.functions = require('./functions');

        this.express = express();

        var DB = require('./components/DB');
        DB.init(this.config.firebase);

        return this;

    },

    run: function()
    {

        this.defineRoutes();

        // start api listening
        this.express.listen(this.config.api.port, () => this.log('App listening on port ' + this.config.api.port + '!'));

        // init socket
        this.initSocket();

        var DBEventListener = require('./components/DBEventListener');
        DBEventListener.listen();

    },

    initSocket: function()
    {

        var self = this;

        var http = require('http').Server(this.express);
        var io = require('socket.io')(http);

        http.listen(self.config.socket.port, function(){
            console.log('Chat socket listening on ' + self.config.socket.port);
        });

        io.on('connection', function(socket){

            socket.user_id = null;

            socket.on('authorize', function(data){

                self.log("Socket trying to authorize with: " + data);
                var UserController = require('./controllers/UserController');
                UserController.processAuthorize(data, function(user){

                    if(user){
                        socket.user_id = data; // save just id
                        socket.emit('authorized', 1);
                        self.log("authorization succesful");
                    }else{
                        self.log("authorization failed");
                    }

                });

            });

            // this is a chat socket
            socket.on('setChatData', function(data){

                if(typeof data.group_id != 'undefined'){ // this should always be present

                    socket.chatData = data;
                    self.chatSockets[socket.id] = socket;
                    self.log('Chat socket id: ' + socket.id);

                }else{

                    self.log("Incorrect chatData received: " + JSON.stringify(data));
                    socket.emit('socket_error', 'Incorrect chatData received');

                }

            });

            socket.on('message', function(data){

                if(socket.user_id){ // if im authorized

                    if(socket.chatData){

                        user_id = socket.user_id;

                        message = data.message;
                        group_id = socket.chatData.group_id;
                        order_id = socket.chatData.order_id;
                        var MessagesController = require('./controllers/MessagesController');
                        MessagesController.addMessage(user_id, group_id, order_id, message);

                    }else{
                        self.log("No chatData when receiving message");
                        socket.emit('socket_error', 'Send chatData before sending messages');
                    }

                }else{
                    self.log("unauthorized socket tried to send message");
                    socket.emit('socket_error', 'You are not authorized');
                }

            });

            socket.on('disconnect', function (){

                var id = socket.id;
                if(socket.chatData){ // this is a chat socket
                    delete self.chatSockets[id];
                }

                self.log("Socket " + id + " disconnected");

            });

        });

    },

    defineRoutes: function()
    {

        var controller, action = false;
        self = this;

        this.express.get('/order/getAllData/:group/:id', function(req, res){

            var params = req.params;

            var OrderController = require('./controllers/OrderController');
            OrderController.actionGetAllData(params, function(response){

                self.respond(res, response.content, response.status);

            });


        });

        this.express.get('/mode/getAll/', function(req, res){

            var controller = require('./controllers/ModeController');
            controller.actionGetAll(function(response){
                self.respond(res, response.content, response.status);
            });

        });

        this.express.get('/order/setDone/:group/:id', function(req, res){

            var params = req.params;

            var OrderController = require('./controllers/OrderController');
            OrderController.actionSetDone(params, function(response){

                self.respond(res, response.content, response.status);

            });

        });

        this.express.get('/order/getSOSOrders/:group', function(req, res){

            var params = req.params;

            var OrderController = require('./controllers/OrderController');
            OrderController.actionGetSOSOrders(params, function(response){

                self.respond(res, response.content, response.status);

            });

        });

        this.express.get('/order/get/:group/:id', function(req, res){

            var params = req.params;

            var OrderController = require('./controllers/OrderController');
            OrderController.actionGet(params, function(response){

                self.respond(res, response.content, response.status);

            });


        });

        this.express.get('/user/get/:uid', function(req, res){

            var UserController = require('./controllers/UserController');
            UserController.actionGet(req.params, function(response){

                self.respond(res, response.content, response.status);

            });

        });

        this.express.get('/messages/get/:group/:order', function(req, res){
            var MessagesController = require('./controllers/MessagesController');
            MessagesController.actionGet(req.params, function(response){

                self.respond(res, response.content, response.status);

            });
        });

        this.express.get('/socket.io', function(req, res){
            self.respond(res, 'ok');
        });

        // generic
        /*this.express.get('/:controller/:action', function (req, res) {
            self.processGenericRequest(req, res);
        });

        this.express.get('/:controller', function (req, res) {
            self.processGenericRequest(req, res);
        });

        this.express.get('/', function (req, res) {
            self.processGenericRequest(req, res);
        }); */

    },

    respond: function(res, content, status)
    {
        status = typeof status == 'undefined' ? 200 : status;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Content-Type', 'application/json');
        res.status(status).send(JSON.stringify(content)).end();
    },

    processGenericRequest: function(req, res)
    {

        var self = this;

        var params = req.params;
        var controller = typeof params.controller != 'undefined' ? params.controller : 'index';
        var action = typeof params.action != 'undefined' ? params.action : 'index';

        self.log("Processing generic request. Controller: " + controller + ". Action: " + action);

        controller = self.getControllerName(controller);
        action = self.getActionName(action);

        controller_obj = self.getController(controller);

        if(!controller_obj || typeof controller_obj[action] != 'function'){

            self.log('Bad request');

            controller = self.getControllerName(self.config.error.controller);
            controller_obj = self.getController(controller);
            action = self.getActionName(self.config.error.action);

            params = {};
            params.error = 'Bad request';

        }

        if(controller_obj && action){
            self.log('Calling: ' + controller + '.' + action);
            controller_obj.callAction(action, params, function(content, status){

                self.respond(res, content, status);

            });
        }else{
            self.respond(res, {error: "Bad request"}, 400);
        }

    },

    parseRequest: function (req)
    {

        var parts = req.path.split('/').filter(String);

        var controller = typeof parts[0] != 'undefined' ? parts[0] : 'index';
        var action = typeof parts[1] != 'undefined' ? parts[1] : 'index';

        return {controller: controller, action: action, params: req.params};

    },

    getController: function(controller_name)
    {

        if(typeof this.controllers == 'undefined'){
            this.controllers = {};
        }

        if(typeof this.controllers.controller_name == 'undefined'){ // not yet defined

            var path = 'controllers/' + controller_name + '.js';

            if(fs.existsSync(path)){ // controller exists

                this.controllers[controller_name] = require('./' + path);

            }

        }

        return (typeof this.controllers[controller_name] != 'undefined') ? this.controllers[controller_name] : false;

    },

    getControllerName: function(controller)
    {

        return this.functions.ucFirst(controller) + 'Controller';

    },

    getActionName: function(action)
    {
        self = this;
        var action = action.split('-').map(function(e){ return self.functions.ucFirst(e); }).join('');

        return 'action' + action;
    },

    log: function (data)
    {

        console.log(data);
        var date, logdate, logfile, month, year;

        logdate = new Date();
        year = logdate.getFullYear();
        month = logdate.getMonth();
        month++;
        month = month.toString();

        if (month.length === 1) {
            month = '0' + month;
        }

        date = logdate.getDate().toString();
        if (date.length === 1) {
            date = '0' + date;
        }

        logfile = __dirname + '/logs/' + year + '.' + month + '.' + date + '.log';
        fs.appendFile(logfile, this.functions.getDateTime() + '\n' + data + "\n----\n", function(err){});

    },

}


