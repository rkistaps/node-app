const db = require('./../components/DB')
const firebase = require('./../components/FireBase')
const User = require('./User')

var Message = {

    path: 'msgs',

    getByGroupAndOrder: function (group, order, callback) {

        var ref = db.instance.ref(this.path + "/" + group + "/" + order);

        ref.once("value", function (snapshot) {

            var messages = snapshot.val()
            var users = {}
            if (messages) {

                var user_ids = []
                for (var i in messages) {
                    user_ids[user_ids.length] = messages[i].createdBy
                }

                User.getByIds(user_ids, function (users) {

                    callback({
                        messages: messages,
                        users: users,
                        // media: media
                    })

                    // this doesnt work at all
                    // firebase.getMediaFromMessages(group, order, messages, function (media) {})

                })

            } else {
                callback({
                    messages: messages,
                    users: users
                });
            }

        });

    },

    loadMessageUsers: function (messages, callback) {

    }

}

BaseModel = require('./../components/BaseModel.js');
Message = Object.assign(Message, BaseModel);

module.exports = Message;