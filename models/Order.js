const db = require('./../components/DB')
const User = require('./User')
const Mode = require('./Mode')
const functions = require('./../functions')
const debounce = require('debounce');

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

        var debounce = require('debounce');
        var self = this;

        this.get(group, id, function(order){

            Mode.getReason(order.modeReason, function(result){

                order.reason = result
                Mode.getStatus(order.modeStatus, function(result){

                    order.status = result
                    Mode.getType(order.modeType, function(result){

                        order.type = result

                        User.get(order.createdBy, function(result){

                            order.user = result
                            var debounced = debounce(function(){
                                // console.log('calling callback')
                                callback(order);
                            }, 250) // wait 250 after new result

                            if(order.notifications){

                                order.notification_users= {}
                                
                                for(var i in order.notifications){

                                    User.get(i, function(user, uid){
                                        
                                        // console.log('debounce')
                                        debounced() // new result
                                        order.notification_users[uid] = user
                                        
                                    }) 
        
                                }
            
                            } 
                            
                        });

                    })

                })

            });

        });

    }

}

module.exports = Order;