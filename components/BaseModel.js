var App = require('./../App');
var db = require('./../components/DB');

module.exports = {

    insert: function(data)
    {

        if(typeof this.path == 'undefined' || !this.path){
            App.log("Can't insert. No path..");
            App.log("Data: " + JSON.stringify(data));
        }

        var ref = db.instance.ref(this.path);
        var newRef = ref.push(data);

        return newRef.key;

    },

    // path: this.path + 'path/to/my/location'
    insertPath: function(path, data)
    {

        if(typeof this.path == 'undefined' || !this.path){
            App.log("Can't insert. No path..");
            App.log("Data: " + JSON.stringify(data));
        }

        var ref = db.instance.ref(this.path + '/' + path);
        var newRef = ref.push(data);

        return newRef.key;

    }

}