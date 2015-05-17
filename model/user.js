// This is a JavaScript file

'user strict'

var fs                  = require('fs');
var uuid                = require('node-uuid');
var crypto              = require('crypto');
var easyimg             = require('easyimage');
var generatePassword    = require('password-generator');

var transporter         = require('./../config/config-mail.js');
var pathToSource        = 'public/src/';
var pathToThumbnail     = 'public/src/thumbnail/';
var connection;

var UserAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

UserAPI.prototype.userSendSupport = function() {
    return function(req, res){
        var data = req.body;
        if (data.subject && data.subject.length > 0) {
            var mailOptions = {
                from    : data.user_id + '@online9.mobi <' + data.email + '>',
                to      : 'contact.online9@gmail.com',
                subject : data.subject,
                html    : data.message
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    res.status(500).json('error');
                }else{
                    mailOptions = {
                        from    : 'Online 9 <contact.online9@gmail.com>',
                        to      : data.email,
                        subject : 'Notification for your request',
                        html    : 'Greetings from Online 9,' 
                                + '<br><br>Thanks you for contacting us.' 
                                + '<br><br>We have received your request regarding <' + data.subject + '>.' 
                                              + '<br><br><br>'
                                              + 'Sincerely, <br>The Online 9 Team'
                                              + '<br><br>'
                                              + '=======================================<br>'
                                              + 'Online 9 | Your Online Mobile Shopping Experience<br>'
                                              + 'Email : contact.online9@gmail.com<br>'
                                              + 'Phone: (855) 23-9999 999 / 12-999 999<br>'
                                              + 'Address : Sen Sok, Phnom Penh, Cambodia<br>'
                                              + 'Website : https://online9.mobi<br>'
                                              + '=======================================<br>'

                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                            res.status(500).json('error');
                        }else{
                            res.status(200).json('sent');
                        }
                    });
                }
            });
        }
    };
}

UserAPI.prototype.userSendMail = function() {
    return function(req, res){
        var user = req.body;
        verifyId = uuid.v4();
        host     = req.get('host');
        link     = "http://" + req.get('host') + "/verify?id=" + verifyId;

        // setup e-mail data with unicode symbols
        mailOptions = {
            from    : 'Online 9 <contact.online9@gmail.com>',
            to      : user.email,
            subject : 'Please confirm your email account',
            html    : 'Dear ' + user.first_name + ',' 
                    + '<br><br>Greetings from Online 9.' 
                    + '<br><br>Thank you for signing up for Online 9, Your Online Mobile Shopping Experience.'
                    + '<br><br>To complete your account registration, please click on the following link to verify your email.' 
                    + '<br><br><a href=' + link + '>' + link + '</a>'
                                  + '<br><br><br>'
                                  + 'Sincerely, <br>The Online 9 Team'
                                  + '<br><br>'
                                  + '=======================================<br>'
                                  + 'Online 9 | Your Online Mobile Shopping Experience<br>'
                                  + 'Email : contact.online9@gmail.com<br>'
                                  + 'Phone: (855) 23-9999 999 / 12-999 999<br>'
                                  + 'Address : Sen Sok, Phnom Penh, Cambodia<br>'
                                  + 'Website : https://online9.mobi<br>'
                                  + '=======================================<br>'

        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.status(500).json('error');
            }else{
                connection.query("UPDATE online9_tb_user SET verified = ? WHERE user_id = ?", [verifyId, user.user_id], function(err, result) {
                    if (!err) {
                        console.log('Message sent: ' + info.response);
                        res.status(200).json('sent');
                    }
                    else {
                        res.status(500).json('error');
                    }
                });
            }
        });
    };
}

UserAPI.prototype.userResetPassword = function() {
    return function(req, res){
        var user;
        var email = req.body.email;
        var newPassword = generatePassword();
        var hashPassword = crypto.createHash('sha256').update(newPassword).digest('base64');
        connection.query('SELECT user_id, first_name FROM online9_tb_user WHERE email = ?', email, function(err, rows, fields) {
          if (!err) {
              user = rows[0];
              connection.query('UPDATE online9_tb_user SET password = ? WHERE email = ?', [hashPassword, email], function(err, result) {
                  if (!err) {
                      mailOptions = {
                          from    : 'Online 9 <contact.online9@gmail.com>',
                          to      : email,
                          subject : 'Notification for password reset',
                          html    : 'Dear ' + user.first_name + ',' 
                                  + '<br><br>Greetings from Online 9.' 
                                  + '<br><br>A new password has been generated for your account.' 
                                  + '<br>Please use the following information to login and then reset your password.<br>'
                                  + '<br>Username     : ' + user.user_id
                                  + '<br>New password : ' + newPassword
                                  + '<br><br><br>'
                                  + 'Sincerely, <br>The Online 9 Team'
                                  + '<br><br>'
                                  + '=======================================<br>'
                                  + 'Online 9 | Your Online Mobile Shopping Experience<br>'
                                  + 'Email : contact.online9@gmail.com<br>'
                                  + 'Phone: (855) 23-9999 999 / 12-999 999<br>'
                                  + 'Address : Sen Sok, Phnom Penh, Cambodia<br>'
                                  + 'Website : https://online9.mobi<br>'
                                  + '=======================================<br>'
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                          if(error){
                              res.status(500).json('error');
                              console.log(error);
                          }else{
                              res.status(200).json('sent');
                              console.log('Message sent: ' + info.response);
                          }
                      });
                  }
                  else {
                      res.status(500).json('error');
                  }
              });
          }
          else {
              res.status(500).json('error');
              console.log('Error while performing Query.');
          }
        });
    };
}

UserAPI.prototype.userVerify = function() {
    return function(req, res){
        if((req.protocol + "://" + req.get('host')) == ("http://" + host))
        {
            var verifiedId = req.query.id;
            connection.query('SELECT user_id, email FROM online9_tb_user WHERE verified = ?', verifiedId, function(err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        var user = rows[0];
                        connection.query("UPDATE online9_tb_user SET verified = 'yes' WHERE user_id = ?", user.user_id, function(err, result) {
                            if (!err) {
                                console.log("email is verified");
                                res.end("You account with email: [" + user.email + "] has been successfully verified.");
                            }
                            else
                            {
                                console.log("email is not verified");
                                res.end("Bad Request!");
                            }
                        });
                    }
                    else {
                        console.log("Your verification is expired.");
                        res.end("Your verification is expired.");
                    }
                }
                else
                {
                    console.log("email is not verified");
                    res.end("Bad Request!");
                }
            });
        }
        else
        {
            res.end("Request is from unknown source. Your verification is expired.");
        }
    };
}

UserAPI.prototype.userList = function() {
    return function(req, res){
        connection.query('SELECT * FROM online9_tb_user ORDER BY id DESC', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows);
            }
            else {              
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userCount = function() {
    return function(req, res){
        connection.query('SELECT COUNT(id) AS n_users FROM online9_tb_user', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_users);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userById = function() {
    return function(req, res){
        connection.query('SELECT * from online9_tb_user WHERE user_id = ?', req.body.user_id, function(err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    res.status(200).json(rows[0]);
                }
                else {
                    res.status(500).json(rows);
                }
            }
            else {        
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userCheck = function() {
    return function(req, res){
        connection.query('SELECT id from online9_tb_user WHERE user_id = ?', req.body.user_id, function(err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    res.status(200).json('exist');
                }
                else {
                    res.status(200).json('available');
                }
            }
            else {              
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userEmailCheck = function() {
    return function(req, res){
        connection.query('SELECT id from online9_tb_user WHERE email = ?', req.body.email, function(err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    res.status(200).json('exist');
                }
                else {
                    res.status(200).json('available');
                }
            }
            else {        
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userLogin = function() {
    return function(req, res) {
        var data = req.body;
        var hashPassword = crypto.createHash('sha256').update(data.password).digest('base64');
        connection.query("SELECT * FROM online9_tb_user WHERE user_id = ? AND password = ?", [data.user_id, hashPassword], function(err, result) {
            if (!err) {
                if (result.length > 0) {
                    var userResult = result[0];
                    if (userResult.verified ==='yes') {
                        connection.query("UPDATE online9_tb_user SET active = 'on', device = ? WHERE user_id = ?", [data.device, data.user_id], function(err, result) {
                            if (!err) {
                                userResult.active = 'on';
                                res.status(200).json(userResult);
                            }
                            else {
                                res.status(500).json(result);
                                console.log('Error while performing Query.');
                            }
                        });
                    }
                    else {
                        res.status(500).json('needVerify');
                        console.log('Account is not yet verified.');
                    }
                }
                else {
                    res.status(500).json(result);
                    console.log('Login failed.');
                }
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userLogout = function() {
    return function(req, res) {
        connection.query("UPDATE online9_tb_user SET active = 'off' WHERE user_id = ?", req.body.user_id, function(err, result) {
            if (!err) {
                query = connection.query('SELECT id FROM online9_tb_user WHERE user_id = ?', req.body.user_id, function(err, result) {
                    if (!err) {
                        if (result.length > 0) {
                            res.status(200).json(result);
                        }
                        else {
                            res.status(500).json(result);
                        }
                    }
                    else {
                        res.status(500).json(result);
                        console.log('Error while performing Query.');
                    }
                });
            }
        });
    };
};

UserAPI.prototype.userAdd = function() {
    return function(req, res) {
        var data = req.body;
        var hashPassword = crypto.createHash('sha256').update(data.password).digest('base64');
        var post  = {
            user_id    : data.user_id, 
            first_name : data.first_name, 
            last_name  : data.last_name, 
            email      : data.email, 
            password   : hashPassword,
            location   : data.location,
            phone      : data.phone,
            active     : data.active,
            photo      : data.photo,
            info       : data.info,
            role       : data.role,
            verified   : 'no'
        };
        connection.query('INSERT INTO online9_tb_user SET ?', post, function(err, result) {
            if (!err) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };    
};

UserAPI.prototype.userDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_user WHERE user_id = ', req.body.user_id, function(err, result) {
            if (!err) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var post  = {
            first_name  : data.first_name, 
            last_name   : data.last_name, 
            email       : data.email, 
            password    : data.password,
            addr        : data.addr,
            phone       : data.phone,
            active      : data.active,
            photo       : data.photo
        };
        connection.query('UPDATE online9_tb_user SET ? WHERE user_id = ?', [post, data.user_id], function(err, result) {
            if (!err) {
                res.status(200).json(rows);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userImageUpload = function() {
    return function(req, res) {
        var user_id = req.body.user_id;
        var file    = req.files.file;

        if (file === undefined) {
            var fileName  = 'user_default.png';
        }
        else {
            var tmpPath   = file.path;
            var extIndex  = tmpPath.lastIndexOf('.');
            var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
            var fileName  = user_id + '_' + uuid.v4() + extension;
            var thumbPath = pathToThumbnail + fileName;
          
            easyimg.rescrop({
                src: tmpPath, dst: thumbPath,
                width:100, height:100,
                cropwidth:80, cropheight:80,
                gravity: 'Center'
            })
            .then(
                function(image) {},
                function (err) {
                    // console.log(err);
                }
            );
        }

        connection.query('UPDATE online9_tb_user SET ? WHERE user_id = ?', [{ photo : fileName }, user_id], function(err, result) {
            if (!err) {
                res.status(200).json(result);
            }
            else {
                return res.status(400).send('Image is not saved:');
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userPasswordCheck = function() {
    return function(req, res) {
        var user = req.body;
        var hashPassword = crypto.createHash('sha256').update(user.password).digest('base64');
        connection.query("SELECT id FROM online9_tb_user WHERE user_id = ? AND password = ?", [user.user_id, hashPassword], function(err, result) {
            if (!err) {
                if (result.length > 0) {
                  res.status(200).json('exist');
                }
                else {
                    res.status(200).json('available');
                }
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

UserAPI.prototype.userPasswordChange = function() {
    return function(req, res) {
        var user = req.body;
        var hashPassword = crypto.createHash('sha256').update(user.password).digest('base64');
        connection.query("UPDATE online9_tb_user SET ? WHERE user_id = ?", [{password : hashPassword}, user.user_id], function(err, result) {
            if (!err) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

module.exports = UserAPI;

