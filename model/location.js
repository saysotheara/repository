
'user strict'

var LocationAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

LocationAPI.prototype.locationList = function() {
	return function(req, res){
		connection.query('SELECT * from online9_tb_location', function(err, rows, fields) {
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

LocationAPI.prototype.locationCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_locations from online9_tb_location', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_locations);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
}


LocationAPI.prototype.locationAdd = function() {
    return function(req, res) {
        var data = req.body;
        var location = {
            location   	: data.location, 
            description : data.description,
            other		: data.other
        };
        connection.query('INSERT INTO online9_tb_location SET ?', location, function(err, result) {
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

LocationAPI.prototype.locationDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_location WHERE id = ', req.body.id, function(err, result) {
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

LocationAPI.prototype.locationUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var location = {
            location   	: data.location, 
            description : data.description,
            other		: data.other
        };
        connection.query('UPDATE online9_tb_location SET ? WHERE id = ?', [location, data.id], function(err, result) {
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


module.exports = LocationAPI;

