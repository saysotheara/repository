

'user strict'

var HelpAPI = function( sqlConnection ) {
    connection = sqlConnection;
}

HelpAPI.prototype.helpList = function() {
	return function(req, res){
		connection.query('SELECT * from online9_tb_help', function(err, rows, fields) {
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


module.exports = HelpAPI;

