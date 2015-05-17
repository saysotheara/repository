// This is a main js

var express     = require('express');
var favicon     = require('express-favicon');
var bodyParser 	= require('body-parser');
var multiparty  = require('connect-multiparty');

var port        = 3000;
var app         = express();
var jsonParser  = bodyParser.json();

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.get("/", function(req, res){ res.redirect('www/index.html'); });

var connection  = require('./config/config-db.js');
var UserAPI     = require('./model/user.js');
var PostAPI     = require('./model/post.js');
var FavoriteAPI = require('./model/favorite.js');
var LocationAPI = require('./model/location.js');
var TagAPI      = require('./model/tag.js');
var HelpAPI     = require('./model/help.js');
var AboutAPI    = require('./model/about.js');

var user  = new UserAPI( connection );
var post  = new PostAPI( connection );
var fav   = new FavoriteAPI( connection );
var loc   = new LocationAPI( connection );
var tag   = new TagAPI( connection );
var help  = new HelpAPI( connection );
var about = new AboutAPI( connection );

app.get( 
    "/api/user/list", 
    user.userList()
);

app.get( 
    "/api/user/count", 
    user.userCount()
);

app.get(
    "/verify", 
    user.userVerify()
);

app.post( 
    "/api/user/send", 
    jsonParser, 
    user.userSendMail()
);

app.post( 
    "/api/user/reset", 
    jsonParser, 
    user.userResetPassword()
);

app.post( 
    "/api/user/support", 
    jsonParser, 
    user.userSendSupport()
);

app.post( 
    "/api/user/id", 
    jsonParser, 
    user.userById()
);

app.post( 
    "/api/user/check", 
    jsonParser, 
    user.userCheck()
);

app.post( 
    "/api/user/email", 
    jsonParser, 
    user.userEmailCheck()
);

app.post( 
    "/api/user/login", 
    jsonParser, 
    user.userLogin()
);

app.post( 
    "/api/user/logout", 
    jsonParser, 
    user.userLogout()
);

app.post( 
    "/api/user/add", 
    jsonParser, 
    user.userAdd()
);

app.post( 
    "/api/user/delete", 
    jsonParser, 
    user.userDelete()
);

app.post( 
    "/api/user/update", 
    jsonParser, 
    user.userUpdate()
);

app.post( 
    "/api/user/upload", 
    multiparty(), 
    user.userImageUpload()
);

app.post( 
    "/api/user/password/check", 
    jsonParser, 
    user.userPasswordCheck()
);

app.post( 
    "/api/user/password/change", 
    jsonParser, 
    user.userPasswordChange()
);


// POST MGT
app.get( 
    "/api/post/list", 
    post.postList()
);

app.get( 
    "/api/post/count", 
    post.postCount()
);

app.get( 
    "/api/post/limit", 
    post.postLimit()
);

app.post( 
    "/api/post/id", 
    jsonParser, 
    post.postById()
);

app.post( 
    "/api/post/user/count", 
    jsonParser, 
    post.postByUserCount()
);

app.post( 
    "/api/post/upload", 
    multiparty(), 
    post.postImageUpload()
);

app.post( 
    "/api/post/image", 
    jsonParser, 
    post.postImageList()
);

app.post( 
    "/api/post/image/delete", 
    jsonParser, 
    post.postImageDelete()
);

app.post( 
    "/api/post/user", 
    jsonParser, 
    post.postByUser()
);

app.post( 
    "/api/post/tag", 
    jsonParser, 
    post.postByTag()
);

app.post( 
    "/api/post/search", 
    jsonParser, 
    post.postSearch()
);

app.post( 
    "/api/post/add", 
    jsonParser, 
    post.postAdd()
);

app.post( 
    "/api/post/delete", 
    jsonParser, 
    post.postDelete()
);

app.post( 
    "/api/post/update", 
    jsonParser, 
    post.postUpdate()
);


// favorite MGT
app.post( 
    "/api/favorite/list", 
    jsonParser, 
    fav.favoriteList()
);

app.post( 
    "/api/favorite/count", 
    jsonParser, 
    fav.favoriteCount()
);

app.post( 
    "/api/favorite/check", 
    jsonParser, 
    fav.favoriteCheck()
);

app.post( 
    "/api/favorite/add", 
    jsonParser, 
    fav.favoriteAdd()
);

app.post( 
    "/api/favorite/delete", 
    jsonParser, 
    fav.favoriteDelete()
);


// LOCATION MGT
app.get(
    "/api/location/list", 
    loc.locationList()
);


// TAG MGT
app.get(
    "/api/tag/list", 
    tag.tagList()
);


// ABOUT MGT
app.get(
    "/api/about/list", 
    about.aboutList()
);


// Help MGT
app.get(
    "/api/help/list", 
    help.helpList()
);


// SERVER LISTENER
app.listen(port, function() {
    console.log( "Server listening on port " + port);	
});


