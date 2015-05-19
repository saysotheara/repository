

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

HelpAPI.prototype.helpCount = function() {
    return function(req, res) {
        connection.query('SELECT COUNT(id) AS n_help from online9_tb_help', function(err, rows, fields) {
            if (!err) {
                res.status(200).json(rows[0].n_help);
            }
            else {
                res.status(500).json(rows);
                console.log('Error while performing Query.');
            }
        });
    };
}

HelpAPI.prototype.helpAdd = function() {
    return function(req, res) {
        var data = req.body;
        var help = {
            question   	: data.question, 
            answer 		: data.answer,
            type 		: data.type,
            other		: '',
            date 		: new Date()
        };
        connection.query('INSERT INTO online9_tb_help SET ?', help, function(err, result) {
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

HelpAPI.prototype.helpDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_help WHERE id = ', req.body.id, function(err, result) {
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

HelpAPI.prototype.helpUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var help = {
            question   	: data.question, 
            answer 		: data.answer,
            type 		: data.type,
            other		: data.other
        };
        connection.query('UPDATE online9_tb_help SET ? WHERE id = ?', [help, data.id], function(err, result) {
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

module.exports = HelpAPI;

