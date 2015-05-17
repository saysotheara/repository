// This is a JavaScript file

'user strict'

var connection;

var FavoriteAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

FavoriteAPI.prototype.favoriteList = function() {
    return function(req, res) {
        connection.query('SELECT P.* FROM online9_tb_post AS P WHERE P.id IN (SELECT F.post_id FROM online9_tb_favorite AS F WHERE F.user_id = ?) ORDER BY id DESC', req.body.user_id, function(err, result) {
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

FavoriteAPI.prototype.favoriteCount = function() {
    return function(req, res){
        connection.query('SELECT COUNT(id) AS n_favorites FROM online9_tb_favorite WHERE user_id = ?', req.body.user_id, function(err, result) {
            if (!err) {
                res.status(200).json(result[0].n_favorites);
            }
            else {
                res.status(500).json(result);
                console.log('Error while performing Query.');
            }
        });
    };
};

FavoriteAPI.prototype.favoriteCheck = function() {
    return function(req, res) {
        var data = req.body;
        connection.query('SELECT id FROM online9_tb_favorite WHERE post_id = ? AND user_id = ?', [data.post_id, data.user_id], function(err, result) {
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

FavoriteAPI.prototype.favoriteAdd = function() {
    return function(req, res) {
        var data = req.body;
        var post  = {
            post_id     : data.post_id, 
            user_id     : data.user_id
        };
        connection.query('INSERT INTO online9_tb_favorite SET ?', post, function(err, result) {
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

FavoriteAPI.prototype.favoriteDelete = function() {
    return function(req, res) {
        var data = req.body;
        connection.query('DELETE FROM online9_tb_favorite WHERE post_id = ? AND user_id = ?', [data.post_id, data.user_id], function(err, result) {
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

module.exports = FavoriteAPI;

