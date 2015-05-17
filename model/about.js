
'user strict'

var AboutAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

AboutAPI.prototype.aboutList = function() {
	return function(req, res){
		connection.query('SELECT * from online9_tb_about', function(err, rows, fields) {
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


module.exports = AboutAPI;

