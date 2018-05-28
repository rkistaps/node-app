var BaseController = {

    respond: function(response, status)
    {

        status = typeof status == 'undefined' ? 200 : status;
        return {content: response, status: status}

    },

    respondError: function(error, status)
    {

        status = typeof status == 'undefined' ? 400 : status;
        return this.respond({error: error}, status);

    },

    callAction: function(action, params, callback)
    {

        this[action](params, function(response){

            callback(response.content, response.status);

        });

    }

}

module.exports = BaseController;