// This is a JavaScript file

'user strict'

var mysql      	= require('mysql');

var production  = false;
var database_name = (production) ? 'online9_db' : 'khmerio_db';

var connection 	= mysql.createConnection({
 	host     : 'localhost',
  	user     : 'root',
  	password : '',
  	database : database_name
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");  
    } else {
        console.log("Error connecting database ... \n\n");  
    }
});

module.exports = connection;
