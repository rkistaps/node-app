var MessageModel = require('./../models/Message');
var Functions = require('./../functions');

var MessagesController = {

    actionGet: function(params, callback)
    {

        var self = this;

        if(typeof params.group != 'undefined' && typeof params.order != 'undefined'){

            MessageModel.getByGroupAndOrder(params.group, params.order, function(content){

                callback(self.respond(content));

            });

        }else{
            callback(self.respondError('Bad request'));
        }

    },

    addMessage: function(author, group, order, content)
    {

        if(author && group && order && content){

            message = {
                createdBy: author,
                dateTime: Functions.getTimestamp(),
                key: null,
                mediaType: 0,
                msgText: content,
                notifications: []
            };

            MessageModel.insertPath(group + '/' + order, message);

        }

    }

}

BaseController = require('./../components/BaseController.js');
MessagesController = Object.assign(MessagesController, BaseController);

module.exports = MessagesController;