const App = require('./../App');
const db = require('./DB')

module.exports = {

    getFileFromStorage: function name(group, order, key, callback) {




    },

    getMediaFromMessages: function (group_id, order_id, messages, callback) {

        var media = []
        var bucket = db.createBucket('msgs')

        for (var message_key in messages) {

            var message = messages[message_key]

            if (message.mediaType == 1) { // image

                var path = group_id + '/' + order_id + '/' + message.key;
                var file = bucket.file(path)

                file.getMetadata(function (err, metadata, apiResponse) {

                    console.log(err)
                    console.log(metadata)
                    console.log(apiResponse)

                })

            } else if (message.mediaType == 2) { // video

            }

        }

        callback(media)

    }

}