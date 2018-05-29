var db = require('./../components/DB');
var User = require('./User');

var Message = {

    path: 'msgs',

    getByGroupAndOrder: function(group, order, callback)
    {

        var ref = db.instance.ref(this.path + "/" + group + "/" + order);

        ref.once("value", function(snapshot) {

            var result = snapshot.val()
            var users = {}
            if(result){
                var length = Object.keys(result).length
                var counter = 0

                for(var i in result){

                    userRef = db.instance.ref(User.path + "/").child(result[i].createdBy);
                    userRef.once('value', function(user_snap){

                        users[user_snap.key] = user_snap.val();

                        if(++counter == length){ // this was last one
                            callback({messages: result, users: users});
                        }

                    });

                }
            }else{
                callback({messages: result, users: users});    
            }

        });

    },

    loadMessageUsers: function(messages, callback){

    }

}

BaseModel = require('./../components/BaseModel.js');
Message = Object.assign(Message, BaseModel);

module.exports = Message;