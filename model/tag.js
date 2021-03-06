
'user strict'

var TagAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

TagAPI.prototype.tagList = function() {
	return function(req, res) {
		connection.query('SELECT * from online9_tb_tag', function(err, rows, fields) {
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

TagAPI.prototype.tagCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_tags from online9_tb_tag', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_tags);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
}


TagAPI.prototype.tagAdd = function() {
    return function(req, res) {
        var data = req.body;
        var tag = {
            tag   		: data.tag, 
            description : data.description,
            photo 		: data.photo,
            other		: data.other
        };
        connection.query('INSERT INTO online9_tb_tag SET ?', tag, function(err, result) {
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

TagAPI.prototype.tagDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_tag WHERE id = ', req.body.id, function(err, result) {
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

TagAPI.prototype.tagUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var tag = {
            tag   		: data.tag, 
            description : data.description,
            photo 		: data.photo,
            other		: data.other
        };
        connection.query('UPDATE online9_tb_tag SET ? WHERE id = ?', [tag, data.id], function(err, result) {
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

module.exports = TagAPI;

