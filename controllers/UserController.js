var User = require('./../models/User');

var UserController = {

    actionGet: function(params, callback)
    {

        var self = this;

        User.get(params.uid, function(content){
            callback(self.respond(content));
        });

    },

    processAuthorize: function(key, callback)
    {

        // currently key is user id
        User.get(key, function(content){
            callback(content);
        });

    }
}

BaseController = require('./../components/BaseController.js');
UserController = Object.assign(UserController, BaseController);

module.exports = UserController;