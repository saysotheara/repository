
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

AboutAPI.prototype.aboutAdd = function() {
    return function(req, res) {
        var data = req.body;
        var about = {
            headquarters  	: data.headquarters, 
            address 		: data.address,
            phone 			: data.phone,
            email 			: data.email,
            website 		: data.website,
            blog 			: data.blog,
            facebook 		: data.facebook,
            twitter 		: data.twitter,
            url_ios 		: data.url_ios,
            url_android 	: data.url_android,
            url_window 		: data.url_window,
            other			: data.other
        };
        connection.query('INSERT INTO online9_tb_about SET ?', about, function(err, result) {
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

AboutAPI.prototype.aboutDelete = function() {
    return function(req, res) {
        connection.query('DELETE FROME online9_tb_about WHERE id = ', req.body.id, function(err, result) {
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

AboutAPI.prototype.aboutUpdate = function() {
    return function(req, res) {
        var data = req.body;
        var tag = {
            headquarters  	: data.headquarters, 
            address 		: data.address,
            phone 			: data.phone,
            email 			: data.email,
            website 		: data.website,
            blog 			: data.blog,
            facebook 		: data.facebook,
            twitter 		: data.twitter,
            url_ios 		: data.url_ios,
            url_android 	: data.url_android,
            url_window 		: data.url_window,
            other			: data.other
        };
        connection.query('UPDATE online9_tb_about SET ? WHERE id = ?', [about, data.id], function(err, result) {
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

module.exports = AboutAPI;

