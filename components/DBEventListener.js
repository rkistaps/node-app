var App = require('./../App');
var functions = require('./../functions.js');
var Message = require('./../models/Message');
var Order = require('./../models/Order');
var User = require('./../models/User');
var db = require('./DB');
var Mail = require('./Mail');

module.exports = {

    listen: function () {

        this.listenMessages();
        this.listenOrders();

    },

    // for chat messages
    listenMessages: function () {

        MessagesRef = db.instance.ref(Message.path);
        MessagesRef.on('child_added', function (group_snapshot, prevChildKey) { // new group is showing up

            var group_id = group_snapshot.key; // thats group_id

            MessageGroupRef = db.instance.ref(Message.path).child(group_id);
            MessageGroupRef.on('child_added', function (order_snapshot, prevChildKey) { // new order in group

                var order_id = order_snapshot.key; // thats order_id
                MessageGroupOrderRef = db.instance.ref(Message.path).child(group_id).child(order_id);
                MessageGroupOrderRef.on('child_added', function (message_snapshot, prevChildKey) { // new message in group_id/order_id

                    var message = message_snapshot.val();
                    if (!message.sentToChat) { // have i been sent ?

                        message_snapshot.ref.update({
                            sentToChat: true
                        }); // register as sent

                        var emit_sockets = [];
                        // sending to chat group sockets
                        for (var i in App.chatSockets) {

                            var socket = App.chatSockets[i];
                            if (socket.chatData && socket.chatData.group_id == group_id) { // thats my group

                                emit_sockets.push(socket)
                                User.get(message.createdBy, function (user_data) {

                                    var key = functions.getKey(user_data);
                                    user = user_data[key];

                                    var emit_socket = emit_sockets.pop();

                                    var emit_data = {
                                        group_id: group_id,
                                        order_id: order_id,
                                        user_id: key,
                                        user: user.fullName,
                                        message: message.msgText,
                                        mediaType: message.mediaType,
                                        key: message.key,
                                        downloadUrl: message.downloadURL,
                                        time: message.dateTime
                                    };

                                    App.log("New message emit data: " + JSON.stringify(emit_data));

                                    emit_socket.emit('new_message', emit_data);

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
    listenOrders: function () {

        const self = this

        OrderRef = db.instance.ref(Order.path);
        OrderRef.on('child_added', function (group_snapshot, prevChildKey) { // group added

            var group_id = group_snapshot.key; // thats group_id

            GroupOrderRef = db.instance.ref(Order.path).child(group_id);
            GroupOrderRef.on('child_added', function (order_snapshot, prevChildKey) { // new order in group

                var order_id = order_snapshot.key
                var order = order_snapshot.val()

                // add additional data
                order.key = order_id // adding its key            
                order.group_id = group_id; // adding its group 

                if (!order.sosSent && order.modeReason == 1) { // SOS reason 

                    order_snapshot.ref.update({
                        sosSent: true
                    }); // register as sent

                    User.get(App.config.sos_user, function (sos_user_data, uid) { // get sos user

                        if (sos_user_data) {

                            var user_key = functions.getKey(sos_user_data)
                            var sos_user = sos_user_data[user_key]

                            User.get(order.createdBy, function (user_data) { // get order author

                                if (user_data) {
                                    var user_key = functions.getKey(user_data)
                                    var user = user_data[user_key]
                                    var from = App.config.mail.from

                                    sos_user.email = 'ktaube@datateks.lv' // testing
                                    sos_user.email = 'ak@seniorasap.com' // testing

                                    var sosmail = self.createSOSMail(order, user)

                                    Mail.send(from, sos_user.email, sosmail.subject, sosmail.content, function (sent, result) {

                                        if (sent) {
                                            App.log('SOS SENT: ' + JSON.stringify(result));
                                        } else {
                                            App.log('SOS NOT SENT: ' + JSON.stringify(result));
                                        }

                                    })
                                } else {
                                    App.log('No user data for sos user: ' + App.config.sos_user)
                                }

                            })

                        }

                    })

                }

            });

        });

    },

    createSOSMail: function (order, user) {

        var webApp = App.config.web_app

        webUrl = webApp.protocol + '://' + webApp.host + (webApp.port ? ':' + webApp.port : '') + webApp.path
        webUrl += 'order/' + order.group_id + '/' + order.key

        var date = new Date(order.dateTime * 1000);
        var datetime = functions.getDateTime(date);

        var subject = '[SASAP] ' + user.fullName
        var content = 'SASAP lietotājs ' + user.fullName + '<br />'
        content += 'Izsaukuma laiks: ' + datetime + '<br />'
        content += 'Izsaukuma saite: <a href="' + webUrl + '">' + webUrl + '</a>'

        return {
            subject: subject,
            content: content
        }

    }

}