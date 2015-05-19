
'user strict'

var FeedAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

FeedAPI.prototype.feedList = function() {
	return function(req, res) {
		connection.query('SELECT * from online9_tb_feed', function(err, rows, fields) {
	  		if (!err) {
	    		res.status(200).json(rows);
	  		}
	  		else {
	  			res.status(500).json(rows);
	    		console.log('Error while performing Query.');
	  		}
	  	});
	};
}

FeedAPI.prototype.feedCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_feeds from online9_tb_feed', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_feeds);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
}

FeedAPI.prototype.feedAdd = function() {
    return function(req, res) {
        var data = req.body;
        var feed = {
            feed   		: data.feed, 
            description : data.description,
            date 		: new Date()
        };
        connection.query('INSERT INTO online9_tb_feed SET ?', feed, function(err, result) {
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

FeedAPI.prototype.feedDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_feed WHERE id = ', req.body.id, function(err, result) {
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

FeedAPI.prototype.feedUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var feed = {
            feed        : data.feed, 
            description : data.description,
            date        : new Date()
        };
        connection.query('UPDATE online9_tb_feed SET ? WHERE id = ?', [feed, data.id], function(err, result) {
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

module.exports = FeedAPI;

