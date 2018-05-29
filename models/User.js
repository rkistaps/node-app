var db = require('./../components/DB');
var functions = require('./../functions');
const debounce = require('debounce');

var User = {

    path: 'users',

    get: function(uid, callback){

        var ref = db.instance.ref(this.path + "/" + uid);

        ref.once("value", function(snapshot) {
            if(typeof callback == 'function'){

                var content = snapshot.val();
                callback(content, uid);

            }
        });

    },

    getByIds(ids, callback){

        var self = this
        var result = {}

        var debounced = debounce(function(){
            callback(result)
        }, 250)

        for(var i in ids){

            var id = ids[i]
            this.get(id, function(user, uid){

                debounced()
                result[uid] = user

            })

        }

    }

}

module.exports = User;