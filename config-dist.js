module.exports = {
    api: {
        port: 8888,
    },
    socket: {
        port: 8887,
    },
    web_app: {
        protocol: 'http',
        host: 'sos.local',
    },
    firebase: {
        key_location: __dirname + '/' + 'firebase-credentials.json',
        databaseURL: 'https://darkaxe-1111.firebaseio.com'
    },
    error: {
        controller: 'index',
        action: 'error'
    },
    mail: {
        transport: {
            host: 'smtp3.serveris.lv',
            port: 25,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password'
            }
        },
        from: 'ktaube@datateks.lv'
    },
    sos_user: 'BCZm8JdA3ZRarLuM5ngFHEp0LaO2' // 112 user id
}