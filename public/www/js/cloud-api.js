// This is a JavaScript file

'user strict'

function CloudAPI(httpProtocol) {
    
    this.http       = httpProtocol;
    this.baseUrl    = (ons.platform.isIOS() || ons.platform.isAndroid()) ? 'http://8060129e.ngrok.io/' : '/';

    this.sendMailUrl        = 'api/user/send';
    this.sendResetUrl       = 'api/user/reset';
    this.sendSupportUrl     = 'api/support';
    
    this.userListUrl        = 'api/user/list';
    this.userCountUrl       = 'api/user/count';
    this.userByIdUrl        = 'api/user/id';
    this.userCheckUrl       = 'api/user/check';
    this.userSessionUrl     = 'api/user/session';
    this.userLoginUrl       = 'api/user/login';
    this.userLogoutUrl      = 'api/user/logout';
    this.userEmailUrl       = 'api/user/email';
    this.userAddUrl         = 'api/user/add';
    this.userDeleteUrl      = 'api/user/delete';
    this.userUpdateUrl      = 'api/user/update';
    this.userSearchUrl      = 'api/user/search';
    this.userCountUrl       = 'api/user/count';
    this.userUploadUrl      = 'api/user/upload';
    this.userImageUrl       = 'api/user/image';
    this.userPasswordChangeUrl  = 'api/user/password/change';
    this.userPasswordCheckUrl   = 'api/user/password/check';

    this.postListUrl        = 'api/post/list';
    this.postCountUrl       = 'api/post/count';
    this.postLimitUrl       = 'api/post/limit';
    this.postStreamUrl      = 'api/post/stream';
    this.postIdUrl          = 'api/post/id';
    this.postUserUrl        = 'api/post/user';
    this.postUserCountUrl   = 'api/post/user/count';
    this.postTagUrl         = 'api/post/tag';
    this.postSearchUrl      = 'api/post/search';
    this.postAddUrl         = 'api/post/add';
    this.postDeleteUrl      = 'api/post/delete';
    this.postUpdateUrl      = 'api/post/update';
    this.postUploadUrl      = 'api/post/upload';
    this.postImageUrl       = 'api/post/image';
    this.postImageDeleteUrl = 'api/post/image/delete';

    this.favrListUrl        = 'api/favorite/list';
    this.favrCountUrl       = 'api/favorite/count';
    this.favrAddUrl         = 'api/favorite/add';
    this.favrDeleteUrl      = 'api/favorite/delete';
    this.favrCheckUrl       = 'api/favorite/check';
    
    this.tagListUrl         = 'api/tag/list';
    this.tagCountUrl        = 'api/tag/count';
    this.tagAddUrl          = 'api/tag/add';
    this.tagDeleteUrl       = 'api/tag/delete';
    this.tagUpdateUrl       = 'api/tag/update';

    this.locListUrl         = 'api/location/list';
    this.locCountUrl        = 'api/location/count';
    this.locAddUrl          = 'api/location/add';
    this.locDeleteUrl       = 'api/location/delete';
    this.locUpdateUrl       = 'api/location/update';

    this.historyListUrl     = 'api/history/list';
    this.historyAddUrl      = 'api/history/add';
    this.historyDeleteUrl   = 'api/history/delete';

    this.aboutListUrl       = 'api/about/list';
    this.aboutAddUrl        = 'api/about/add';
    this.aboutDeleteUrl     = 'api/about/delete';
    this.aboutUpdateUrl     = 'api/about/update';
    
    this.helpListUrl        = 'api/help/list';
    this.helpCountUrl       = 'api/help/count';
    this.helpAddUrl         = 'api/help/add';
    this.helpDeleteUrl      = 'api/help/delete';
    this.helpUpdateUrl      = 'api/help/update';
    
    this.feedListUrl        = 'api/feed/list';
    this.feedCountUrl       = 'api/feed/count';
    this.feedAddUrl         = 'api/feed/add';
    this.feedDeleteUrl      = 'api/feed/delete';
    this.feedUpdateUrl      = 'api/feed/update';

}

CloudAPI.prototype.getBaseUrl = function() {
    return this.baseUrl;
}

CloudAPI.prototype.sendSupport = function(json) {
    return this.http.post(this.baseUrl + this.sendSupportUrl, json);
}

CloudAPI.prototype.sendMail = function(json) {
    return this.http.post(this.baseUrl + this.sendMailUrl, json);
}

CloudAPI.prototype.sendReset = function(json) {
    return this.http.post(this.baseUrl + this.sendResetUrl, json);
}

CloudAPI.prototype.userList = function() {
    return this.http.get(this.baseUrl + this.userListUrl);
};

CloudAPI.prototype.userCount = function() {
    return this.http.get(this.baseUrl + this.userCountUrl);
};

CloudAPI.prototype.userById = function(json) {
    return this.http.post(this.baseUrl + this.userByIdUrl, json);
};

CloudAPI.prototype.userCheck = function(json) {
    return this.http.post(this.baseUrl + this.userCheckUrl, json);
};

CloudAPI.prototype.userByEmail = function(json) {
    return this.http.post(this.baseUrl + this.userEmailUrl, json);
};

CloudAPI.prototype.userSessionByDeviceId = function(json) {
    return this.http.post(this.baseUrl + this.userSessionUrl, json);
};

CloudAPI.prototype.userLogin = function(json) {
    return this.http.post(this.baseUrl + this.userLoginUrl, json);
};

CloudAPI.prototype.userLogout = function(json) {
    return this.http.post(this.baseUrl + this.userLogoutUrl, json);
};

CloudAPI.prototype.userAdd = function(json) {
    return this.http.post(this.baseUrl + this.userAddUrl, json);
};

CloudAPI.prototype.userDelete = function(json) {
    return this.http.post(this.baseUrl + this.userDeleteUrl, json);
};

CloudAPI.prototype.userUpdate = function(json) {
    return this.http.post(this.baseUrl + this.userUpdateUrl, json);
};

CloudAPI.prototype.userSearch = function(json) {
    return this.http.post(this.baseUrl + this.userSearchUrl, json);
};

CloudAPI.prototype.userImageUpload = function() {
    return this.baseUrl + this.userUploadUrl;
};

CloudAPI.prototype.userImageList = function(json) {
    return this.http.post(this.baseUrl + this.userImageUrl, json);
};

CloudAPI.prototype.userPasswordChange = function(json) {
    return this.http.post(this.baseUrl + this.userPasswordChangeUrl, json);
};

CloudAPI.prototype.userPasswordCheck = function(json) {
    return this.http.post(this.baseUrl + this.userPasswordCheckUrl, json);
};

/**
 * Post Management API
 */

CloudAPI.prototype.postList = function() {
    return this.http.get(this.baseUrl + this.postListUrl);
};

CloudAPI.prototype.postCount = function() {
    return this.http.get(this.baseUrl + this.postCountUrl);
};

CloudAPI.prototype.postLimit = function() {
    return this.http.get(this.baseUrl + this.postLimitUrl);
};

CloudAPI.prototype.postStream = function() {
    return this.http.get(this.baseUrl + this.postStreamUrl);
};

CloudAPI.prototype.postById = function(json) {
    return this.http.post(this.baseUrl + this.postIdUrl, json);
};

CloudAPI.prototype.postUserCount = function(json) {
    return this.http.post(this.baseUrl + this.postUserCountUrl, json);
};

CloudAPI.prototype.postByUser = function(json) {
    return this.http.post(this.baseUrl + this.postUserUrl, json);
};

CloudAPI.prototype.postByTag = function(json) {
    return this.http.post(this.baseUrl + this.postTagUrl, json);
};

CloudAPI.prototype.postSearch = function(json) {
    return this.http.post(this.baseUrl + this.postSearchUrl, json);
};

CloudAPI.prototype.postAdd = function(json) {
    return this.http.post(this.baseUrl + this.postAddUrl, json);
};

CloudAPI.prototype.postDelete = function(json) {
    return this.http.post(this.baseUrl + this.postDeleteUrl, json);
};

CloudAPI.prototype.postUpdate = function(json) {
    return this.http.post(this.baseUrl + this.postUpdateUrl, json);
};

CloudAPI.prototype.postImageUpload = function() {
    return this.baseUrl + this.postUploadUrl;
}

CloudAPI.prototype.postImageList = function(json) {
    return this.http.post(this.baseUrl + this.postImageUrl, json);
};

CloudAPI.prototype.postImageDelete = function(json) {
    return this.http.post(this.baseUrl + this.postImageDeleteUrl, json);
};

/**
 * Favorite Management API
 */
CloudAPI.prototype.favoriteList = function(json) {
    return this.http.post(this.baseUrl + this.favrListUrl, json);
};

CloudAPI.prototype.favoriteCount = function(json) {
    return this.http.post(this.baseUrl + this.favrCountUrl, json);
};

CloudAPI.prototype.favoriteAdd = function(json) {
    return this.http.post(this.baseUrl + this.favrAddUrl, json);
};

CloudAPI.prototype.favoriteDelete = function(json) {
    return this.http.post(this.baseUrl + this.favrDeleteUrl, json);
};

CloudAPI.prototype.favoriteCheck = function(json) {
    return this.http.post(this.baseUrl + this.favrCheckUrl, json);
};

/**
 * Tag Management API
 */
CloudAPI.prototype.tagList = function() {
    return this.http.get(this.baseUrl + this.tagListUrl);
};

CloudAPI.prototype.tagCount = function() {
    return this.http.get(this.baseUrl + this.tagCountUrl);
};

CloudAPI.prototype.tagAdd = function(json) {
    return this.http.post(this.baseUrl + this.tagAddUrl, json);
};

CloudAPI.prototype.tagDelete = function(json) {
    return this.http.post(this.baseUrl + this.tagDeleteUrl, json);
};

CloudAPI.prototype.tagUpdate = function(json) {
    return this.http.post(this.baseUrl + this.tagUpdateUrl, json);
};

/**
 * Location Management API
 */
CloudAPI.prototype.locationList = function() {
    return this.http.get(this.baseUrl + this.locListUrl);
};

CloudAPI.prototype.locationCount = function() {
    return this.http.get(this.baseUrl + this.locCountUrl);
};

CloudAPI.prototype.locationAdd = function(json) {
    return this.http.post(this.baseUrl + this.locAddUrl, json);
};

CloudAPI.prototype.locationDelete = function(json) {
    return this.http.post(this.baseUrl + this.locDeleteUrl, json);
};

CloudAPI.prototype.locationUpdate = function(json) {
    return this.http.post(this.baseUrl + this.locUpdateUrl, json);
};

/**
 * History Management API
 */
CloudAPI.prototype.historyList = function(json) {
    return this.http.post(this.baseUrl + this.historyListUrl);
};

CloudAPI.prototype.historyAdd = function(json) {
    return this.http.post(this.baseUrl + this.historyAddUrl, json);
};

CloudAPI.prototype.historyDelete = function(json) {
    return this.http.post(this.baseUrl + this.historyDeleteUrl, json);
};

/**
 * About Management API
 */
CloudAPI.prototype.aboutList = function() {
    return this.http.get(this.baseUrl + this.aboutListUrl);
};

CloudAPI.prototype.aboutAdd = function(json) {
    return this.http.post(this.baseUrl + this.aboutAddUrl, json);
};

CloudAPI.prototype.aboutDelete = function(json) {
    return this.http.post(this.baseUrl + this.aboutDeleteUrl, json);
};

CloudAPI.prototype.abouUpdate = function(json) {
    return this.http.post(this.baseUrl + this.aboutUpdateUrl, json);
};

/**
 * Help Management API
 */
CloudAPI.prototype.helpList = function() {
    return this.http.get(this.baseUrl + this.helpListUrl);
};

CloudAPI.prototype.helpCount = function() {
    return this.http.get(this.baseUrl + this.helpCountUrl);
};

CloudAPI.prototype.helpAdd = function(json) {
    return this.http.post(this.baseUrl + this.helpAddUrl, json);
};

CloudAPI.prototype.helpDelete = function(json) {
    return this.http.post(this.baseUrl + this.helpDeleteUrl, json);
};

CloudAPI.prototype.helpUpdate = function(json) {
    return this.http.post(this.baseUrl + this.helpUpdateUrl, json);
};

/**
 * Feed Management API
 */
CloudAPI.prototype.feedList = function() {
    return this.http.get(this.baseUrl + this.feedListUrl);
};

CloudAPI.prototype.feedCount = function() {
    return this.http.get(this.baseUrl + this.feedCountUrl);
};

CloudAPI.prototype.feedAdd = function(json) {
    return this.http.post(this.baseUrl + this.feedAddUrl, json);
};

CloudAPI.prototype.feedDelete = function(json) {
    return this.http.post(this.baseUrl + this.feedDeleteUrl, json);
};

CloudAPI.prototype.feedUpdate = function(json) {
    return this.http.post(this.baseUrl + this.feedUpdateUrl, json);
};


module.exports = new CloudAPI();

