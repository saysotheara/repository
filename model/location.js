
'user strict'

var LocationAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

LocationAPI.prototype.locationList = function() {
	return function(req, res){
		connection.query('SELECT location from online9_tb_location', function(err, rows, fields) {
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


module.exports = LocationAPI;

