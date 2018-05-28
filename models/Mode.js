var db = require('./../components/DB');

module.exports = {

    path: 'modes',

    getAll: function(callback)
    {

        var ref = db.instance.ref(this.path);

        ref.once("value").then(function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    getReason: function(id, callback)
    {

        var ref = db.instance.ref(this.path + "/modeReason/" + id);

        ref.once("value").then(function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    getStatus: function(id, callback)
    {

        var ref = db.instance.ref(this.path + "/modeStatus/" + id);

        ref.once("value").then(function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    getType: function(id, callback)
    {

        var ref = db.instance.ref(this.path + "/modeType/" + id);

        ref.once("value").then(function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    }

}