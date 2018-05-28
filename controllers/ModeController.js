var Mode = require('./../models/Mode');

var ModeController = {

    actionGetAll: function(callback)
    {

        var self = this;

        Mode.getAll(function(content){

            callback(self.respond(content));

        });

    }

}

BaseController = require('./../components/BaseController.js');
ModeController = Object.assign(ModeController, BaseController);

module.exports = ModeController;