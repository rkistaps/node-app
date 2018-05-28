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
                // here we hack, cuz db structure is wrong
                // we need to find only Ukey and return lower level
                if(content){
                    //var key = functions.getKey(content)
                    //content = content.key;
                }

                callback(content);

            }
        });

    },

}

module.exports = User;