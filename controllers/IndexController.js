var IndexController = {

    actionIndex: function(params)
    {

        response = 'Index controller index action';

        return this.respond(response);

    },

    actionError: function(params, callback)
    {

        callback(this.respondError(params.error));

    }

}

BaseController = require('./../components/BaseController.js');
IndexController = Object.assign(IndexController, BaseController);

module.exports = IndexController;