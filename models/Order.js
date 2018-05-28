var db = require('./../components/DB');
var User = require('./User');
var Mode = require('./Mode');

var Order = {

    path: 'orders',

    get: function(group, id, callback)
    {

        var ref = db.instance.ref(this.path + "/" + group + "/" + id);

        ref.once("value", function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    getOrders: function(group_id, callback)
    {

        var ref = db.instance.ref(this.path + "/" + group_id);

        ref.once("value", function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    getSOS: function(group_id, callback)
    {

        var ref = db.instance.ref(this.path + "/" + group_id);

        ref.orderByChild("modeReason").equalTo(1).once("value", function(snapshot) {
            if(typeof callback == 'function'){
                callback(snapshot.val());
            }
        });

    },

    setDone: function(group_id, order_id)
    {

        db.instance.ref(this.path + "/" + group_id + "/" + order_id).update({orderStatus: 'done'});

    },

    getAllData: function(group, id, callback)
    {

        this.get(group, id, function(group){

            Mode.getReason(group.modeReason, function(result){

                group.reason = result;
                Mode.getStatus(group.modeStatus, function(result){

                    group.status = result;
                    Mode.getType(group.modeType, function(result){

                        group.type = result

                        User.get(group.createdBy, function(result){

                            group.user = result;
                            callback(group); // returning result

                        });

                    })

                })

            });

        });

    }

}

module.exports = Order;