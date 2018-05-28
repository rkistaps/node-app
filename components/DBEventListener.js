var App = require('./../App');
var functions = require('./../functions.js');
var Message = require('./../models/Message');
var Order = require('./../models/Order');
var User = require('./../models/User');
var db = require('./DB');

module.exports = {

    listen: function()
    {

        this.listenMessages();
        this.listenOrders();

    },

    // for chat messages
    listenMessages: function(){

        MessagesRef = db.instance.ref(Message.path);
        MessagesRef.on('child_added', function(group_snapshot, prevChildKey){ // new group is showing up

            var group_id = group_snapshot.key; // thats group_id

            MessageGroupRef = db.instance.ref(Message.path).child(group_id);
            MessageGroupRef.on('child_added', function(order_snapshot, prevChildKey){ // new order in group

                var order_id = order_snapshot.key; // thats order_id
                MessageGroupOrderRef = db.instance.ref(Message.path).child(group_id).child(order_id);
                MessageGroupOrderRef.on('child_added', function(message_snapshot, prevChildKey){ // new message in group_id/order_id

                    var message = message_snapshot.val();
                    if(!message.sentToChat){ // have i been sent ?

                        message_snapshot.ref.update({sentToChat: true}); // register as sent

                        // sending to chat group sockets
                        for(var i in App.chatSockets){

                            var socket = App.chatSockets[i];
                            if(socket.chatData && socket.chatData.group_id == group_id){ // thats my group

                                User.get(message.createdBy, function(user_data){

                                    var key = functions.getKey(user_data);
                                    user = user_data[key];

                                    var emit_data = {
                                        group_id: group_id,
                                        order_id: order_id,
                                        user_id: key,
                                        user: user.fullName,
                                        message: message.msgText,
                                        time: message.dateTime
                                    };

                                    App.log("New message emit data: " + JSON.stringify(emit_data));

                                    socket.emit('new_message', emit_data);

                                });

                            }

                        }

                        App.log("New message in " + group_id + "/" + order_id + " message: " + message.msgText);

                    }

                });

            });

        });

    },

    // for sending sos emails to 112
    listenOrders: function()
    {

        OrderRef = db.instance.ref(Order.path);
        OrderRef.on('child_added', function(childSnapshot, group_id) {

            var order = childSnapshot.val();

            if(!order.sosSent && order.modeReason == 1){ // SOS reason
                App.log('SOS not sent');
            }

        });

    }


}