config = {
    api: {
        port: 8888,
    },
    socket: {
        port: 8887,
    },
    firebase: {
        key_location: __dirname + '/' + 'firebase-credentials.json',
        databaseURL: 'https://darkaxe-1111.firebaseio.com'
    },
    error: {
        controller: 'index',
        action: 'error'
    }
}

module.exports = config;