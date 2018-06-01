var db = require('./../components/DB');

module.exports = {

    path: 'groups',

    get: function (gid, callback) {

        var ref = db.instance.ref(this.path + "/" + gid);

        ref.once("value", function (snapshot) {
            var content = snapshot.val();
            callback(content, gid);
        });

    },

}