
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


module.exports = TagAPI;

