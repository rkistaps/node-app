var db = require('./../components/DB');
var functions = require('./../functions');

var User = {

    path: 'users',

    get: function(uid, callback)
    {

        var ref = db.instance.ref(this.path + "/" + uid);

        ref.once("value", function(snapshot) {
            if(typeof callback == 'function'){

                var content = snapshot.val();
                callback(content, uid);

            }
        });

    },

}

module.exports = User;