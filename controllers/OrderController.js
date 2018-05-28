const Order = require('./../models/Order');
const UserModel = require('./../models/User');
const functions = require('./../functions');

var OrderController = {

    actionGet: function(params, callback)
    {

        var self = this;

        if(typeof params.id == 'undefined' || typeof params.group == 'undefined'){

            callback(self.respondError('Bad Request', 400));

        }else{

            Order.get(params.group, params.id, function(content){

                callback(self.respond(content));

            });

        }

    },

    actionGetAllData: function(params, callback)
    {

        var self = this;

        if(typeof params.id == 'undefined' || typeof params.group == 'undefined'){

            callback(self.respondError('Bad Request', 400));

        }else{

            Order.getAllData(params.group, params.id, function(content){

                callback(self.respond(content));

            });

        }
    },

    actionSetDone: function(params, callback)
    {

        var self = this;

        if(typeof params.id == 'undefined' || typeof params.group == 'undefined'){

            callback(self.respondError('Bad Request', 400));

        }else{

            Order.setDone(params.group, params.id);
            callback(self.respondError('Bad Request', 400));

        }



        callback(self.respond(1));

    },

    actionGetSOSOrders: function(params, callback)
    {

        var self = this;

        Order.getSOS(params.group, function(orders){

            callback(self.respond(orders));

        });

    },

    actionIndex: function(params, callback)
    {

        callback(this.respondError("Bad request"));

    }

}

BaseController = require('./../components/BaseController.js');
OrderController = Object.assign(OrderController, BaseController);

module.exports = OrderController;