var db = require('./../components/DB');
var User = require('./User');

var Message = {

    path: 'msgs',

    getByGroupAndOrder: function(group, order, callback)
    {

        /*var ref = db.instance.ref(this.path + "/" + group + "/" + order);

        ref.once('value', function(snap){

            snap.forEach(function(item){

            });

            console.log('here');

            ref.off();

        });*/

        ref.once("value", function(snapshot) {

            var result = snapshot.val();
            var length = Object.keys(result).length;
            var counter = 0;

            userRef = [];
            var j = 0;
            for(var i in result){

                userRef[++j] = db.instance.ref(User.path + "/").child(result[i].createdBy);
                userRef[j].once('value', function(user_snap){

                    result[i].user = user_snap.val();

                    if(counter == length){ // this was last one
                        callback(result);
                    }

                });

            }

        });

    }

}

BaseModel = require('./../components/BaseModel.js');
Message = Object.assign(Message, BaseModel);

module.exports = Message;