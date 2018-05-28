const config = require('./../config');
const nodemailer = require('nodemailer');
const striptags = require('striptags');

module.exports = {

    send: function(from, to, subject, text, callback){

        let plain = text; 
        plain.replace('<br />', "\n"); 
        plain.replace('<br>', "\n"); 
        plain = striptags(text); 

        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: plain,
            html: text
        };

        transport = nodemailer.createTransport(config.mail.transport)

        transport.sendMail(mailOptions, (error, info) => {

            if (error) {
                callback(false, error);
            }else{
                callback(true, info);
            }

        });

    }

}