// This is a JavaScript file

'user strict'

var nodemailer          = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "rafita.angkor@gmail.com",
        pass: "_r130056908"
    }
});

module.exports = transporter;
