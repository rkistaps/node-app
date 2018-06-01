var firebase = require('firebase-admin');

module.exports = {

    instance: null,
    config: null,
    firebase_app: null,
    bucket: null,

    init: function (config) {

        this.config = config

        // connect to db
        firebase_credentials = require(this.config.key_location)

        this.firebase_app = firebase.initializeApp({
            credential: firebase.credential.cert(firebase_credentials),
            databaseURL: this.config.databaseURL
        });

        this.instance = this.firebase_app.database()

        this.bucket = this.createBucket('default-bucket')

    },

    createBucket: function (name) {
        return this.firebase_app.storage().bucket(name)
    }

}