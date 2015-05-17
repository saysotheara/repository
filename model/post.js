// This is a JavaScript file

'user strict'

var fs              = require('fs');
var uuid            = require('node-uuid');
var easyimg         = require('easyimage');

var connection;
var pathToSource    = 'public/src/';
var pathToThumbnail = 'public/src/thumbnail/';

var PostAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

PostAPI.prototype.postList = function() {
    return function(req, res){
        connection.query('SELECT * from online9_tb_post ORDER BY id DESC', function(err, rows, fields) {
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

PostAPI.prototype.postLimit = function() {
    return function(req, res){
        connection.query('SELECT * from online9_tb_post ORDER BY id DESC LIMIT 30', function(err, rows, fields) {
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

PostAPI.prototype.postCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_posts from online9_tb_post', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_posts);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
};

PostAPI.prototype.postById = function() {
    return function(req, res) {
        connection.query('SELECT * from online9_tb_post WHERE id = ?', req.body.id, function(err, result) {
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

PostAPI.prototype.postByUserCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_posts from online9_tb_post WHERE user_id = ?', req.body.user_id, function(err, result) {
            if (!err) {
                res.status(200).json(result[0].n_posts);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

PostAPI.prototype.postImageUpload = function() {
    return function(req, res) {
        var post_id = req.body.id;
        var file    = req.files.file;
        var status  = req.body.status;

        if (file === undefined) return 0;

        var tmpPath   = file.path;
        var extIndex  = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        var fileName  = post_id + '_' + uuid.v4() + extension;
        var destPath  = pathToSource + fileName;
        var thumbPath = pathToThumbnail + fileName;
        
        fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                return res.status(400).send('Image is not saved:');
            }

            easyimg.rescrop({
                src: destPath, dst: thumbPath,
                width:100, height:100,
                cropwidth:70, cropheight:70,
                gravity: 'Center'
            }).then(
            function(image) {
                // console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
            },
            function (err) {
                // console.log(err);
            });

            var data = {
                name      : file.name,
                photo     : fileName,
                post_id   : post_id,
                user_id   : req.body.user_id,
                size      : file.size,
                date      : new Date(),
                status    : status
            };

            if (status === 'default') {
                connection.query('UPDATE online9_tb_post SET ? WHERE id = ?', [{ photo : fileName }, post_id], function(err, result) {});
            }
            connection.query('INSERT INTO online9_tb_post_photo SET ?', data, function(err, result) {
                if (!err) {
                    res.status(200).json(result);
                }
                else {
                    return res.status(400).send('Image is not saved:');
                    console.log('Error while performing Query.');
                }
            });
        });
    };
};

PostAPI.prototype.postImageList = function() {
    return function(req, res) {
        connection.query('SELECT * FROM online9_tb_post_photo WHERE post_id = ?', req.body.id, function(err, result) {
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

PostAPI.prototype.postImageDelete = function() {
    return function(req, res) {
        var filename = req.body.photo;
        connection.query('DELETE FROM online9_tb_post_photo WHERE id = ?', req.body.id, function(err, result) {
            if (!err) {
                fs.stat(pathToSource + filename, function(err, stat) {
                    if(err == null) {
                        fs.unlink( pathToSource + filename );
                        fs.unlink( pathToThumbnail + filename );
                    }
                    else {
                        console.log('error: ', err.code);
                    }
                });
                res.status(200).json(result);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

PostAPI.prototype.postByUser = function() {
    return function(req, res) {
        connection.query('SELECT * from online9_tb_post WHERE user_id = ? ORDER BY id DESC', req.body.user_id, function(err, result) {
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

PostAPI.prototype.postByTag = function() {
    return function(req, res) {
        connection.query('SELECT * from online9_tb_post WHERE tag = ?', req.body.tag, function(err, result) {
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

PostAPI.prototype.postSearch = function() {
    return function(req, res) {
        // var term = '+' + req.body.term;
        // var query = connection.query('SELECT * from online9_tb_post WHERE MATCH(post) AGAINST(? IN BOOLEAN MODE) ORDER BY id DESC', term, function(err, result) {
        var term = '%' + req.body.term + '%';
        connection.query('SELECT * from online9_tb_post WHERE post LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT 50', [term, term], function(err, result) {
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

PostAPI.prototype.postAdd = function() {
    return function(req, res) {
        var data = req.body;
        var post  = {
            post        : data.post, 
            description : data.description, 
            location    : data.location, 
            price       : data.price,
            date        : data.date,
            email       : data.email, 
            phone       : data.phone,
            tag         : data.tag,
            user_id     : data.user_id
        };
        connection.query('INSERT INTO online9_tb_post SET ?', post, function(err, result) {
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

PostAPI.prototype.postDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROM online9_tb_post WHERE id = ?', req.body.id, function(err, result) {
            if (!err) {
                connection.query('DELETE FROM online9_tb_favorite WHERE post_id = ?', req.body.id, function(err, result) {
                    if (!err) {
                        connection.query('DELETE FROM online9_tb_history WHERE post_id = ?', req.body.id, function(err, result) {
                            if (!err) {
                                connection.query('DELETE FROM online9_tb_post_photo WHERE post_id = ?', req.body.id, function(err, result) {
                                    if (!err) {
                                        if(result.affectedRows > 0) {
                                            fs.unlink(pathToSource + req.body.photo);
                                            fs.unlink(pathToThumbnail + req.body.photo);
                                        }
                                        res.status(200).json(result);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

PostAPI.prototype.postUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var post  = {
                post        : data.post, 
                description : data.description, 
                price       : data.price,
                phone       : data.phone,
                email       : data.email
        };
        connection.query('UPDATE online9_tb_post SET ? WHERE id = ?', [post, data.id], function(err, result) {
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


module.exports = PostAPI;

