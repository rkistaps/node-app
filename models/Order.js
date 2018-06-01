const db = require('./../components/DB')
const User = require('./User')
const Mode = require('./Mode')
const Group = require('./Group')
const functions = require('./../functions')

var Order = {

    path: 'orders',

    get: function (group, id, callback) {

        var ref = db.instance.ref(this.path + "/" + group + "/" + id);

        ref.once("value", function (snapshot) {
            if (typeof callback == 'function') {
                callback(snapshot.val());
            }
        });

    },

    getOrders: function (group_id, callback) {

        var ref = db.instance.ref(this.path + "/" + group_id);

        ref.once("value", function (snapshot) {
            if (typeof callback == 'function') {
                callback(snapshot.val());
            }
        });

    },

    getSOS: function (group_id, callback) {

        var ref = db.instance.ref(this.path + "/" + group_id);

        ref.orderByChild("modeReason").equalTo(1).once("value", function (snapshot) {
            if (typeof callback == 'function') {
                callback(snapshot.val());
            }
        });

    },

    setDone: function (group_id, order_id) {

        db.instance.ref(this.path + "/" + group_id + "/" + order_id).update({
            orderStatus: 'done'
        });

    },

    getAllData: function (group, id, callback) {

        var self = this;

        this.get(group, id, function (order) {

            if (order) {
                Mode.getReason(order.modeReason, function (result) {

                    order.reason = result
                    Mode.getStatus(order.modeStatus, function (result) {

                        order.status = result
                        Mode.getType(order.modeType, function (result) {

                            order.type = result
                            User.get(order.createdBy, function (result) {

                                order.user = result
                                order.notifications = order.notifications ? order.notifications : {}
                                user_ids = Object.keys(order.notifications)

                                Group.get(group, function (data) {

                                    order.groupData = data
                                    for (var i in data) {
                                        user_ids.push(i)
                                    }

                                    User.getByIds(user_ids, function (users) {

                                        order.users = users
                                        callback(order);

                                    })

                                })

                            })

                        })

                    })

                })
            } else {
                callback({})
            }

        });

    }

}

module.exports = Order;