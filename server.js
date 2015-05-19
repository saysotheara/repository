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
var FeedAPI     = require('./model/feed.js');

var user  = new UserAPI( connection );
var post  = new PostAPI( connection );
var fav   = new FavoriteAPI( connection );
var loc   = new LocationAPI( connection );
var tag   = new TagAPI( connection );
var help  = new HelpAPI( connection );
var about = new AboutAPI( connection );
var feed  = new FeedAPI( connection );

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

app.get(
    "/api/location/count", 
    loc.locationCount()
);

app.post(
    "/api/location/add", 
    jsonParser, 
    loc.locationAdd()
);

app.post(
    "/api/location/delete", 
    jsonParser, 
    loc.locationDelete()
);

app.post(
    "/api/location/update", 
    jsonParser, 
    loc.locationUpdate()
);


// TAG MGT
app.get(
    "/api/tag/list", 
    tag.tagList()
);

app.get(
    "/api/tag/count", 
    tag.tagCount()
);

app.post(
    "/api/tag/add", 
    jsonParser, 
    tag.tagAdd()
);

app.post(
    "/api/tag/delete", 
    jsonParser, 
    tag.tagDelete()
);

app.post(
    "/api/tag/update", 
    jsonParser, 
    tag.tagUpdate()
);


// ABOUT MGT
app.get(
    "/api/about/list", 
    about.aboutList()
);

app.post(
    "/api/about/add", 
    jsonParser, 
    about.aboutAdd()
);

app.post(
    "/api/about/delete", 
    jsonParser, 
    about.aboutDelete()
);

app.post(
    "/api/about/update", 
    jsonParser, 
    about.aboutUpdate()
);


// Help MGT
app.get(
    "/api/help/list", 
    help.helpList()
);

app.get(
    "/api/help/count", 
    help.helpCount()
);

// Help MGT
app.post(
    "/api/help/add", 
    jsonParser, 
    help.helpAdd()
);

// Help MGT
app.post(
    "/api/help/delete", 
    jsonParser, 
    help.helpDelete()
);

// Help MGT
app.post(
    "/api/help/update", 
    jsonParser, 
    help.helpUpdate()
);


// Feed MGT
app.get(
    "/api/feed/list", 
    feed.feedList()
);

app.get(
    "/api/feed/count", 
    feed.feedCount()
);

// Feed MGT
app.post(
    "/api/feed/add", 
    jsonParser, 
    feed.feedAdd()
);

// Feed MGT
app.post(
    "/api/feed/delete", 
    jsonParser, 
    feed.feedDelete()
);

// Feed MGT
app.post(
    "/api/feed/update", 
    jsonParser, 
    feed.feedUpdate()
);


// SERVER LISTENER
app.listen(port, function() {
    console.log( "Server listening on port " + port);	
});


