const fs = require('fs')

fs.readFile('app.pid', function (err, data) {

    if (data) {
        console.log('Killing process with pid: ' + data)
        process.kill(data)
    } else {
        console.log('Error: ' + JSON.stringify(err))
    }

})