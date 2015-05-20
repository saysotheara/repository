// This is a JavaScript file

var app = angular.module('main', ['onsen', 'LocalStorageModule', 'ngFileUpload', 'infinite-scroll'])

app.controller('MainController', ['$scope', 'service', '$http', '$q', '$timeout', 'localStorageService', function($scope, service, $http, $q, $timeout, localStorageService) {
    
    $scope.thumbPath = service.thumbPath;
    $scope.items = [];

    if (service.tag === undefined) {
        service.showSpinner();
        service.cloudAPI.postLimit()
            .success( function(result) {
                $scope.items = result;
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
        $scope.pageTitle = 'Dashboard';
    }
    else if (service.tag === 'favorite') {
        $scope.$on('refresh:favorite', function(){
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].id == service.item.id) {
                    $scope.items.splice(i, 1);
                    break;
                }
            };
        });
        if (service.isLoggined() === true) {
            $scope.user = service.getCurrentUser();
            service.showSpinner();
            service.cloudAPI.favoriteList( { user_id : $scope.user.user_id } )
                .success( function(result, status){
                    $scope.items = result;
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
        $scope.pageTitle = 'Favorites';
    }
    else if (service.tag === 'history') {
        $scope.pageTitle = 'View History';        
    }
    else {
        service.showSpinner();
        service.cloudAPI.postByTag( {tag : service.tag} )
            .success( function(result, status, headers, config){
                $scope.items = result;
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
        $scope.pageTitle = service.tag;
    }

    $scope.refresh = function($done) {
        $timeout(function() {
            service.cloudAPI.postLimit()
                .success( function(result) {
                    $scope.items = result;
                })
                .error(function() {
                    $scope.items = [];
                })
                .finally(function() {
                    $done();
                }
            );
        }, 1000);
    };

    $scope.loadNext = function() {
        if ($scope.items.length < 200) {
            service.showSpinner();
            service.cloudAPI.postLimit()
                .success( function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        $scope.items.push(result);
                    }
                    $scope.$apply();
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
    };

    $scope.onItemSelect = function(item) {
        service.item = item;
        $scope.app.navi.pushPage('detail.html', { animation: 'slide' } )
    }
    
}]);


app.controller('SearchController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    $scope.thumbPath = service.thumbPath;
    
    $scope.$watch('searchText', function (tmpStr)
    {
        if(!tmpStr || tmpStr == "" || tmpStr === undefined || tmpStr.length < 3) {
            $scope.items = "";
            return 0;
        }
        
        if (tmpStr === $scope.searchText)
        {
            service.cloudAPI.postSearch( { term : tmpStr } )
                .success( function(result, status){
                    $scope.items = result;
                }
            );
        }
    });
    
    $scope.onItemSelect = function(item) {
        service.item = item;
        $scope.app.navi.pushPage('detail.html', { animation: 'slide' } )
    }
    
}]);


// This is a ProductController
app.controller('ProductController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
        
    $scope.tags = service.getCategories();
    
    $scope.onTagClicked = function(tag) {
        service.tag = tag;
        $scope.app.slidingMenu.setMainPage('home.html', {  animation: "fade", closeMenu: true });
    }
    
}]);


// This is a DetailPhotoController
app.controller('DetailPhotoController', ['$rootScope','$scope', 'service', '$http', '$q', '$controller', function($rootScope, $scope, service, $http, $q, $controller) {

    $scope.files = [];
    $scope.srcPath = service.srcPath;
    service.showSpinner();
    service.cloudAPI.postImageList( {id : service.item.id} )
        .success( function(result, status){
            $scope.files = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );

}]);


// This is a DetailController
app.controller('DetailController', ['$rootScope','$scope', 'service', '$http', '$q', '$controller', function($rootScope, $scope, service, $http, $q, $controller) {
        
    angular.extend(this, $controller('DetailPhotoController', {$scope: $scope}));

    $scope._Index = 0;
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.files.length - 1;
    };
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.files.length - 1) ? ++$scope._Index : 0;
    };
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    $scope.item = service.item;
    $scope.user = service.getCurrentUser();

    if (service.isLoggined()) {
        var data = {
            post_id : $scope.item.id,
            user_id : $scope.user.user_id
        };
        service.cloudAPI.favoriteCheck( data )
            .success( function(result, status){
                $scope.isFavorited = (result === 'exist') ? true : false;
            }
        );
        
        $scope.onFavoriteAdd = function() {
            service.showSpinner();
            service.cloudAPI.favoriteAdd( data )
                .success( function(result, status){
                    $scope.isFavorited = true;
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
        $scope.onFavoriteRemove = function() {
            service.showSpinner();
            service.cloudAPI.favoriteDelete( data )
                .success( function(result, status){
                    $scope.isFavorited = false;
                    $rootScope.$broadcast('refresh:favorite');
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
    }
}]);

// This is a MyPostDetailController
app.controller('MyPostDetailController', ['$rootScope','$scope', 'service', '$http', '$q', '$controller', function($rootScope, $scope, service, $http, $q, $controller) {

    angular.extend(this, $controller('DetailController', {$scope: $scope}));

    $scope.$on('refresh:my_post_photo_delete', function(){
        $scope.files.splice(service.photoIndex, 1);
    });

    if (service.isLoggined()) {

        $scope.isUpdating = false;
        $scope.tags = service.getCategories();

        $scope.showMyPost = (service.showMyPost) ? true : false;
        
        $scope.onPostUpdate = function() {
            $scope.isUpdating = true;
        };

        $scope.onFocus = function() {
            $scope.required = {
                post    : 'false',
                price   : 'false',
                phone   : 'false',
                email   : 'false'
            };
        };

        $scope.onFocus();
        $scope.onUpdateCancel = function() {
            $scope.isUpdating = false;
        }
        $scope.onUpdateDone   = function() {
            if ($scope.item.post === '') {
                $scope.required.title = 'true';
                return 0;
            }
            if ($scope.item.price === '') {
                $scope.required.price = 'true';
                return 0;
            }
            if ($scope.item.phone === '') {
                $scope.required.phone = 'true';
                return 0;
            }
            if ($scope.item.email === '') {
                $scope.required.email = 'true';
                return 0;
            }
            var data  = {
                id          : $scope.item.id,
                post        : $scope.item.post, 
                description : $scope.item.description, 
                price       : $scope.item.price,
                phone       : $scope.item.phone.trim(),
                email       : $scope.item.email.trim()
            };
            service.showSpinner();
            service.cloudAPI.postUpdate( data )
                .success( function(result, status){
                    $scope.isUpdating = false;
                    ons.notification.alert({ message: 'Your post has been updated sucessfully!' });
                })
                .error( function(result, status) {
                    if (status == 500) {
                        ons.notification.alert({ message: 'Your post cannot be saved. Please try again.' });
                    }
                    else {
                        ons.notification.alert({ message: 'Network Error. Please check your connection and try again.' });                
                    }
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        };

        $scope.onPostDelete = function() {
            ons.notification.confirm({
                message: 'Are you sure you want to delete this post?',
                callback: function(index) {
                    if (index == 1) {
                        service.showSpinner();
                        service.cloudAPI.postDelete( { id : $scope.item.id, photo : $scope.item.photo } )
                            .success( function(result, status){
                                ons.notification.alert({ message: 'The post has been deleted successfully.' });
                                $rootScope.$broadcast("refresh:items");
                                $scope.nav.profile.popPage();
                            })
                            .error( function(result, status) {
                                ons.notification.alert({ message: 'The post cannot be deleted. Please try again.' });
                            })
                            .finally(function() {
                                service.hideSpinner();
                            }
                        );
                    }
                }
            });
        };

        $scope.onAddPhoto = function() {
            service.canAdd = true;
            $scope.nav.profile.pushPage('my_post_photo.html', { animation : 'slide' } );
        };
        $scope.viewPhoto = function() {
            service.canAdd = false;
            $scope.nav.profile.pushPage('my_post_photo_view.html', { animation : 'slide' } );
        };
    }

}]);


// This is a PostingController
app.controller('PostingController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'Upload', function($rootScope, $scope, service, $http, $q, $controller, Upload) {

    if (service.isLoggined()) {
        $scope.user = service.getCurrentUser();
        $scope.tags = service.getCategories();
        
        $scope.onFocus = function() {
            $scope.required = {
                title   : 'false',
                price   : 'false',
                tag     : 'false',
                phone   : 'false',
                email   : 'false'
            };
        };
        $scope.onClearClick = function() {
            $scope.onFocus();
            $scope.post = {
                title   : '',
                desc    : '',
                price   : '',
                tag     : '',
                phone   : $scope.user.phone,
                email   : $scope.user.email
            };
            $scope.files = [];
        }
        
        $scope.files = [];
        $scope.$watch('files', function() {
        });

        $scope.onDeletePhoto = function(index) {
            $scope.$apply($scope.files.splice(index, 1));
        };        

        function uploadPhoto(id, files) {
            if (files && files.length) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: service.cloudAPI.postImageUpload(),
                            fields: {
                                'id'        : id,
                                'user_id'   : $scope.user.user_id,
                                'status'    : 'default'
                            },
                            file: file
                        }).progress(function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function (data, status, headers, config) {
                            $scope.$apply();
                        });
                    }
                }
            }
        };

        $scope.onClearClick();
        $scope.onPostSubmit = function() {

            if ($scope.post.title === '') {
                $scope.required.title = 'true';
                return 0;
            }
            if ($scope.post.price === '') {
                $scope.required.price = 'true';
                return 0;
            }
            if ($scope.post.phone === '' || $scope.post.phone.length < 8) {
                $scope.required.phone = 'true';
                return 0;
            }
            if ($scope.post.email === '') {
                $scope.required.email = 'true';
                return 0;
            }
            if ($scope.post.tag === '') {
                $scope.required.tag = 'true';
                return 0;
            }
            
            var data  = {
                post        : $scope.post.title, 
                description : $scope.post.description, 
                price       : $scope.post.price,
                tag         : $scope.post.tag.tag,
                phone       : $scope.post.phone.trim(),
                email       : $scope.post.email.trim(),
                location    : $scope.user.location, 
                user_id     : $scope.user.user_id,
                date        : new Date(),
                photo       : 'none'
            };

            service.showSpinner();
            service.cloudAPI.postAdd( data )
                .success( function(result, status){
                    uploadPhoto(result.insertId, $scope.files);
                    ons.notification.alert({ message: 'Your post has been recorded sucessfully.' });
                    $rootScope.$broadcast("refresh:my_post_add");
                    $scope.onClearClick();
                })
                .error( function() {
                    ons.notification.alert({ title: 'Error', message: 'Failed to post, please try again.' });
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        };
    }

}]);


app.controller('ProfileController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'localStorageService', 'Upload', function($rootScope, $scope, service, $http, $q, $controller, localStorageService, Upload) {
    $scope.thumbPath = service.thumbPath;
    
    $scope.$on('refresh:items', function(){
        $scope.n_posts--;
        service.cloudAPI.favoriteCount( { user_id : $scope.user.user_id } )
            .success( function(result, status){
                $scope.n_favorites = result[0].n_favorites;
            }
        );
    });
    $scope.$on('refresh:my_post_add', function(){
        $scope.n_posts++;
    });

    if (service.isLoggined()) {
        $scope.n_posts = 0;
        $scope.n_favorites = 0;
        $scope.n_following = 0;
        $scope.n_followers = 0;
        $scope.user = service.getCurrentUser();
        service.showSpinner();
        service.cloudAPI.favoriteCount( { user_id : $scope.user.user_id } )
            .success( function(result, status){
                $scope.n_favorites = result;
            }
        );
        service.cloudAPI.postUserCount( { user_id : $scope.user.user_id } )
            .success( function(result, status){
                $scope.n_posts = result;
            })
            .finally( function() {
                service.hideSpinner();
            }
        );

        $scope.userPhoto = '';
        $scope.$watch('userPhoto', function() {
            if ($scope.userPhoto && $scope.userPhoto !== '' && $scope.userPhoto !== undefined) {
                service.showSpinnerAuto();
                Upload.upload({
                    url: service.cloudAPI.userImageUpload(),
                    fields: {
                        'user_id'   : $scope.user.user_id
                    },
                    file: $scope.userPhoto
                }).success(function (data, status, headers, config) {
                    service.cloudAPI.userById( { user_id : $scope.user.user_id } )
                        .success( function(result, status){
                            service.setCurrentUser(result);
                            localStorageService.set('currentUser', result);
                            $scope.$apply($scope.user.photo = result.photo);
                            service.hideSpinner();
                        })
                        .error( function() {
                            ons.notification.alert( { message : 'Failed to upload photo. Please try again.'});
                            service.hideSpinner();
                        }
                    );
                })
                .error( function() {
                    ons.notification.alert( { message : 'Failed to upload photo. Please try again.'});
                    service.hideSpinner();
                });
            }
        });

        $scope.onLogout = function() {
            service.returnTo === 'profile';
            ons.notification.confirm({
                message: 'Are you sure you want to logout?',
                callback: function(index) {
                    if (index == 1) {
                        service.showSpinner();
                        service.cloudAPI.userLogout( { user_id : $scope.user.user_id } )
                            .success( function(result, status){
                                service.setCurrentUser('');
                                localStorageService.remove('currentUser');
                                $rootScope.$broadcast('refresh:logout_done');
                                $scope.app.slidingMenu.setMainPage('login.html', {  animation: "fade", closeMenu: true });
                            })
                            .error( function(data, status) {
                                ons.notification.alert({ title: 'Logout failed', message: 'Network Error. Please check your connection and try again.' });                
                            })
                            .finally(function() {
                                service.hideSpinner();
                            }
                        );
                    }
                }
            });
        }
        $scope.viewMyPost = function() {
            service.showMyPost = true;
            $scope.nav.profile.pushPage('my_post.html', { animation: 'slide' });
        };
        $scope.viewMyFavorite  = function() {
            service.showMyPost = false;
            $scope.nav.profile.pushPage('my_post.html', { animation: 'slide' });
        };
        $scope.viewProfile  = function() {
            $scope.nav.profile.pushPage('my_profile.html', { animation: 'slide' });
        };
        $scope.updateProfile  = function() {
            $scope.nav.profile.pushPage('my_profile_update.html', { animation: 'slide' });
        };
        $scope.changePassword = function() {
            $scope.nav.profile.pushPage('my_password.html', { animation: 'slide' });
        };
    }
}]);

app.controller('MyProfileController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    
    service.showSpinner();
    service.cloudAPI.userById( { user_id : service.getCurrentUser().user_id } )
        .success( function(result, status){
            $scope.user = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
    
    $scope.onFocus = function() {
        $scope.required = {
            user_id             : '',
            email               : '',
            phone               : '',
            address             : ''
        };
    }
    var isUserExisted, isEmailExisted;
    $scope.onUserIDBlur = function() {
        service.cloudAPI.userCheck( {user_id: $scope.user.user_id} )
            .success( function(result, status){
                if (result === 'exist') {
                    isUserExisted = true;
                    $scope.required.user_id = 'true';
                }
                else {
                    isUserExisted = false;
                }
            }
        );
    };
    $scope.onEmailBlur = function() {
        service.cloudAPI.userByEmail( {email: $scope.user.email} )
            .success( function(result, status){
                if (result === 'exist') {
                    isEmailExisted = true;
                    $scope.required.email = 'true';
                }
                else {
                    isEmailExisted = false;
                }
            }
        );
    };
        
    $scope.onUpdateProfile  = function() {
        if ($scope.user.user_id === '' || isUserExisted) {
            $scope.required.user_id = 'true';
            return 0;
        }
        if ($scope.user.email === '' || isEmailExisted) {
            $scope.required.email = 'true';
            return 0;
        }
        if ($scope.user.phone === '' || $scope.user.phone.length < 8) {
            $scope.required.phone = 'true';
            return 0;
        }
        if ($scope.user.address === '') {
            $scope.required.address = 'true';
            return 0;
        }
        var data  = {
        	    user_id     : $scope.user.user_id.trim(), 
			    first_name  : $scope.user.first_name.trim(), 
			    last_name   : $scope.user.last_name.trim(), 
			    email       : $scope.user.email.trim(), 
			    address     : $scope.user.address, 
			    phone       : $scope.user.phone.trim(), 
                info        : $scope.user.info
        };
        service.showSpinner();
        service.cloudAPI.userUpdate( data )
            .success( function(result, status){
                $scope.nav.login.popPage();
                ons.notification.alert({ message: 'Account has been updated successfully.' });
            })
            .error( function(data, status) {
                if (status == 500) {
                    ons.notification.alert({ message: 'Cannot update, please try again.' });
                }
                else {
                    ons.notification.alert({ message: 'Network Error. Please check your connection and try again.' });                
                }
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
    };

    $scope.updateProfile  = function() {
        $scope.nav.profile.pushPage('my_profile_update.html', { animation: 'slide' });
    };
    $scope.changePassword = function() {
        $scope.nav.profile.pushPage('my_password.html', { animation: 'slide' });
    };
}]);

app.controller('MyPasswordController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    $scope.user = service.getCurrentUser();

    function setDefault() {
        $scope.password_old     = '';
        $scope.password_new     = '';
        $scope.password_confirm = '';
        $scope.validPassword  = false;        
        $scope.required = {
            password_old     : '',
            password_new     : '',
            password_confirm : ''
        }
    }
    setDefault();
    $scope.onFocus = function() {
        $scope.required = {
            password_old     : '',
            password_new     : '',
            password_confirm : ''
        }
        $scope.message = '';
    }
    $scope.onPasswordBlur = function() {
        service.cloudAPI.userPasswordCheck( { user_id : $scope.user.user_id, password : $scope.password_old } )
            .success( function(result, status){
                $scope.validPassword = (result === 'exist') ? true : false;
            })
            .error( function() {
                $scope.validPassword = false;
            }
        );
    }
    $scope.onChangePassword = function() {
        if ($scope.password_old === '') {
            $scope.required.password_old = 'true';
            $scope.message = 'Old password is required.';
            return 0;
        }
        if ($scope.password_new === '') {
            $scope.required.password_new = 'true';
            $scope.message = 'New password is required.';
            return 0;
        }
        if ($scope.password_confirm === '') {
            $scope.required.password_confirm = 'true';
            $scope.message = 'Confirm password is required.';
            return 0;
        }
        if ($scope.password_confirm !== $scope.password_new) {
            $scope.required.password_confirm = 'true';
            $scope.message = 'Confirm password is not matched.';
            return 0;
        }
        if ($scope.validPassword === true) {
            service.showSpinner();
            service.cloudAPI.userPasswordChange( { user_id : $scope.user.user_id, password : $scope.password_new } )
                .success( function(result, status){
                    ons.notification.alert({ message: 'Your password has been changed.' });
                    $scope.nav.profile.popPage();
                })
                .error( function() {
                    $scope.message = 'Error, please try again';
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
        else {
            $scope.message = 'Old password is not valid.';
            setDefault();
        }
    }

}]);

app.controller('MyPostController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {

    $scope.thumbPath = service.thumbPath;

    function fetchPostByUser() {
        service.cloudAPI.postByUser( { user_id : service.getCurrentUser().user_id } )
            .success( function(result, status){
                $scope.items = result;
            }
        );
    };
    
    $scope.$on('refresh:my_post', function(){
        fetchPostByUser();
    });

    $scope.$on('refresh:my_post_add', function(){
        fetchPostByUser();
    });

    $scope.$on('refresh:items', function(){
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id == service.item.id) {
                $scope.items.splice(i, 1);
                break;
            }
        };
    });
    
    if (service.isLoggined()) {
        $scope.showMyPost = service.showMyPost;
        $scope.user = service.getCurrentUser();
        service.showSpinner();
        if (service.showMyPost) {
            service.cloudAPI.postByUser( { user_id : $scope.user.user_id } )
                .success( function(result, status){
                    $scope.items = result;
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
        else {
            service.cloudAPI.favoriteList( { user_id : $scope.user.user_id } )
                .success( function(result, status){
                    $scope.items = result;
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        }
        $scope.onItemSelect = function(item) {
            service.item = item;
            $scope.nav.profile.pushPage('my_post_detail.html', { animation: 'slide' } );                    
        }
    }

}]);

app.controller('MyPostPhotoController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'Upload', function($rootScope, $scope, service, $http, $q, $controller, Upload) {

    $scope.canAdd = service.canAdd;
    $scope.thumbPath = service.thumbPath;

    $scope.files = [];
    service.showSpinner();
    service.cloudAPI.postImageList( {id : service.item.id} )
        .success( function(result, status){
            $scope.files = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );

    if ($scope.canAdd) {
        $scope.$watch('files', function() {
            $scope.progressVisible = false;

            // var rand = getRandomInt(1, files.length);
            // for (var i = 0; i < files.length; i++) {
            //     $scope.fileStatus[i] = 'none';
            //     if (i === rand) $scope.fileStatus[i] = 'default';
            //     alert($scope.fileStatus[i]);
            // }
        });

        $scope.onUpload = function(file) {
            Upload.upload({
                url: service.cloudAPI.postImageUpload(),
                fields: {
                    'id'        : service.item.id,
                    'user_id'   : service.item.user_id,
                    'status'    : 'default'
                },
                file: file
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.$apply();
            });
        };
        $scope.onDelete = function(index) {
            $scope.$apply($scope.files.splice(index, 1));
        };

        $scope.onUploadAll = function(files) {
            $scope.progressVisible = true;
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: service.cloudAPI.postImageUpload(),
                        fields: {
                            'id'        : service.item.id,
                            'user_id'   : service.item.user_id,
                            'status'    : 'default'
                        },
                        file: file
                    }).progress(function (evt) {
                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        $scope.$apply();
                        $rootScope.$broadcast('refresh:my_post');
                    });
                }
            }
        };
        $scope.onDeleteAll = function() {
            $scope.files = [];
            $scope.$apply();
        };
    }
    else {
        $scope.onDelete = function(index) {
            service.showSpinner();
            service.cloudAPI.postImageDelete( {id : $scope.files[index].id, photo : $scope.files[index].photo} )
                .success( function(result, status){
                    service.photoIndex = index;
                    $scope.$apply($scope.files.splice(index, 1));
                    $rootScope.$broadcast('refresh:my_post_photo_delete');
                })
                .finally(function() {
                    service.hideSpinner();
                }
            );
        };
    }
}]);


app.controller('LoginController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'localStorageService', function($rootScope, $scope, service, $http, $q, $controller, localStorageService) {

    $scope.$on('refresh:login', function(){
        $scope.user_id = service.user_id;
        if (service.email !== undefined) {
            $scope.message = 'A verification email has been sent to ['+ service.email + ']. Please check your inbox and verify before logging in!';
        }
    });
    $scope.$on('refresh:password', function(){
        if (service.email !== undefined) {
            $scope.message = 'A notification email has been sent to ['+ service.email + ']. Please check your inbox and login again!';
        }
    });

    $scope.onFocus = function() {
        $scope.required = {
            user_id     : '',
            password    : ''
        };
        $scope.message  = '';
    }
    $scope.onClearClick = function() {
        $scope.onFocus();
        $scope.user_id  = '';
        $scope.password = '';
    }
    $scope.onClearClick();
    $scope.onLoginSubmit = function() {
        if ($scope.user_id === '') {
            $scope.required.user_id = 'true';
            return 0;
        }
        if ($scope.password === '') {
            $scope.required.password = 'true';
            return 0;
        }
        var data  = {
			    user_id     : $scope.user_id, 
			    password    : $scope.password,
                device      : 'none'
        };
        service.showSpinner();
        service.cloudAPI.userLogin( data )
            .success( function(result, status){
                service.setCurrentUser( result );
                localStorageService.set('currentUser', result);
                $rootScope.$broadcast('refresh:login_done');
                if (service.returnTo === 'favorite') {
                    service.tag = 'favorite';
                    $scope.app.slidingMenu.setMainPage('home.html', {  animation: "fade", closeMenu: true });
                }
                else if (service.returnTo === 'posting') {
                    $scope.app.slidingMenu.setMainPage('posting.html', {  animation: "fade", closeMenu: true });
                }
                else {
                    $scope.app.slidingMenu.setMainPage('profile.html', {  animation: "fade", closeMenu: true });
                }
            })
            .error( function(data, status) {
                if (status == 500) {
                    $scope.password = '';
                    if (data == 'needVerify') {
                        ons.notification.alert({ title: 'Login failed', message: 'Your account is not yet verified. Please verify and try again.' });
                    }
                    else {
                        ons.notification.alert({ title: 'Login failed', message: 'Your login information is not correct. Please try again.' });
                    }
                }
                else {
                    ons.notification.alert({ title: 'Login failed', message: 'Network Error. Please check your connection and try again.' });
                }
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
    }

    $scope.dialogs = {};
    $scope.show = function(dlg) {
        $scope.message = '';
        if (!$scope.dialogs[dlg]) {
            ons.createDialog(dlg).then(function(dialog) {
                $scope.dialogs[dlg] = dialog;
                dialog.show();
            });
        }
        else {
            $scope.dialogs[dlg].show();
        }
    }

    $scope.onSignupClick = function() {
        $scope.message = '';
        $scope.nav.login.pushPage('signup.html', { animation : 'lift' });
    }
}]);

app.controller('DialogController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', function($rootScope, $scope, service, $http, $q, $controller) {

    $scope.email = '';
    $scope.required = 'none';
    function sentResetMail(userEmail) {
        service.showSpinner();
        service.cloudAPI.sendReset( { email: userEmail } )
            .success( function(result, status){
                service.email = userEmail;
                $rootScope.$broadcast('refresh:password');
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
    }
    $scope.onFocus = function() {
        $scope.required = 'none';
    }
    $scope.onResetPassword = function() {
        if ($scope.email.length > 5 && $scope.email.indexOf('@') > -1 && $scope.email.indexOf('.') > -1) {
            service.cloudAPI.userByEmail( { email: $scope.email } )
                .success( function(result, status){
                if (result === 'exist') {
                    $scope.dialog.hide();
                    sentResetMail($scope.email);
                }
                else {
                    $scope.email = '';
                    $scope.required = 'true';
                }
            });
        }
        else {
            $scope.email = '';   
            $scope.required = 'true';
        }
    }

}]);


app.controller('SignupController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'Upload', function($rootScope, $scope, service, $http, $q, $controller, Upload) {

    service.cloudAPI.locationList()
        .success( function(result, status){
            $scope.locations = result;
        }
    );
    $scope.onFocus = function() {
        $scope.required = {
            user_id     : '',
            email       : '',
            phone       : '',
            password    : '',
            repassword  : '',
            location    : ''
        };
    }
    $scope.onClearClick = function() {
        $scope.onFocus();
        $scope.user = {
            user_id     : '',
		    first_name  : '', 
		    last_name   : '', 
		    email       : '', 
		    password    : '', 
		    location    : '', 
		    phone       : '', 
            info        : '', 
		    photo       : 'images/user_default.png'
        };
    };
    var isUserExisted, isEmailExisted;
    $scope.onUserIDBlur = function() {
        service.cloudAPI.userCheck( {user_id: $scope.user.user_id} )
            .success( function(result, status){
                if (result === 'exist') {
                    isUserExisted = true;
                    $scope.required.user_id = 'true';
                }
                else {
                    isUserExisted = false;
                }
            }
        );
    };
    $scope.onEmailBlur = function() {
        service.cloudAPI.userByEmail( {email: $scope.user.email} )
            .success( function(result, status){
                if (result === 'exist') {
                    isEmailExisted = true;
                    $scope.required.email = 'true';
                }
                else {
                    isEmailExisted = false;
                }
            }
        );
    };
        
    $scope.onClearClick();
    $scope.onSignupSubmit = function() {

        if ($scope.user.user_id === '' || isUserExisted) {
            $scope.required.user_id = 'true';
            return 0;
        }
        if ($scope.user.email === '' || isEmailExisted) {
            $scope.required.email = 'true';
            return 0;
        }
        if ($scope.user.phone === '' || $scope.user.phone.length < 8) {
            $scope.required.phone = 'true';
            return 0;
        }
        if ($scope.user.password === '') {
            $scope.required.password = 'true';
            return 0;
        }
        else {
            if (!angular.equals($scope.user.password, $scope.user.repassword)) {
                $scope.required.repassword = 'true';
                return 0;
            }
        }
        if ($scope.user.location === '') {
            $scope.required.location = 'true';
            return 0;
        }
        var data  = {
    		    user_id     : $scope.user.user_id.trim(), 
			    first_name  : $scope.user.first_name.trim(), 
			    last_name   : $scope.user.last_name.trim(), 
			    email       : $scope.user.email.trim(), 
			    password    : $scope.user.password, 
			    location    : $scope.user.location.location, 
			    phone       : $scope.user.phone.trim(), 
                info        : $scope.user.info, 
			    photo       : 'user_default.png', 
    		    active      : 'off',
                role        : 'user'
        };
        function sendMail(data) {
            service.cloudAPI.sendMail(data)
                .success( function(result) {
                    service.email = data.email;
                    $rootScope.$broadcast("refresh:login");
                }
            );
        }
        service.showSpinner();
        service.cloudAPI.userAdd( data )
            .success( function(result, status){
                sendMail(data);
                service.email   = undefined;
                service.user_id = $scope.user.user_id;
                $scope.uploadPhoto( $scope.userPhoto[0] );
                $rootScope.$broadcast("refresh:login");
                $scope.nav.login.popPage();
                ons.notification.alert({ title: 'Registered', message: 'Account has been registered successfully.' });
            })
            .error( function(data, status) {
                if (status == 500) {
                    ons.notification.alert({ title: 'Signup failed', message: 'Please make sure information is correct and try again.' });
                }
                else {
                    ons.notification.alert({ title: 'Signup failed', message: 'Network Error. Please check your connection and try again.' });                
                }
            })
            .finally(function() {
                service.hideSpinner();
            }
        );
    }
    
    $scope.userPhoto = '';
    $scope.$watch('userPhoto', function() {
    });

    $scope.uploadPhoto = function(file) {
        Upload.upload({
            url: service.cloudAPI.userImageUpload(),
            fields: {
                'user_id'   : $scope.user.user_id
            },
            file: file
        }).progress(function (evt) {
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data, status, headers, config) {
            $scope.$apply();
        });
    };
}]);

// This is a MenuController
app.controller('MenuController', ['$rootScope', '$scope', 'service', '$http', '$q', '$controller', 'localStorageService', function($rootScope, $scope, service, $http, $q, $controller, localStorageService) {

    $scope.thumbPath = service.thumbPath;
    $scope.isLoggined = service.isLoggined();
    
    $scope.$on('refresh:login_done', function(){
        $scope.isLoggined = true;
        $scope.user = service.getCurrentUser();
    });
    $scope.$on('refresh:logout_done', function(){
        $scope.isLoggined = false;
    });

    if (localStorageService.get('currentUser') !== null) {
        var user = localStorageService.get('currentUser')
        service.cloudAPI.userCheck( {user_id : user.user_id} )
            .success(function(result, status) {
                if (result === 'exist') {
                    $scope.isLoggined = true;
                    service.setCurrentUser(user);
                    $scope.user = user;
                }
                else {
                    $scope.isLoggined = false;
                    service.setCurrentUser('');
                    localStorageService.remove('currentUser');
                }
            }
        );
    }

    $scope.onOnlineMarketClick = function() {
        service.tag = undefined;
        $scope.app.slidingMenu.setMainPage('home.html', {closeMenu: true});
    }

    $scope.onFavoriteClick = function() {
        service.tag = 'favorite';
        service.returnTo = 'favorite';
        if (service.isLoggined() === true) {
            $scope.app.slidingMenu.setMainPage('home.html', {closeMenu: true});
        }
        else {
            $scope.app.slidingMenu.setMainPage('login.html', {closeMenu: true});
        }
    }

    $scope.onHistoryClick = function() {
        service.tag = 'history';
        $scope.app.slidingMenu.setMainPage('home.html', {closeMenu: true});
    }

    $scope.onPostingClick = function() {
        service.returnTo = 'posting';
        if (service.isLoggined() === true) {
            $scope.app.slidingMenu.setMainPage('posting.html', {closeMenu: true});
        }
        else {
            $scope.app.slidingMenu.setMainPage('login.html', {closeMenu: true});
        }
    }

    $scope.onProfileClick = function() {
        service.returnTo = 'profile';
        if (service.isLoggined() === true) {
            $scope.app.slidingMenu.setMainPage('profile.html', {closeMenu: true});
        }
        else {
            $scope.app.slidingMenu.setMainPage('login.html', {closeMenu: true});
        }
    }

    $scope.onAccountClick = function() {
            service.returnTo === 'profile';
            ons.notification.confirm({
                message: 'Are you sure you want to logout?',
                callback: function(index) {
                    if (index == 1) {
                        $scope.app.slidingMenu.closeMenu();
                        service.showSpinner();
                        service.cloudAPI.userLogout( { user_id : $scope.user.user_id } )
                            .success( function(result, status){
                                service.setCurrentUser('');
                                localStorageService.remove('currentUser');
                                $rootScope.$broadcast('refresh:logout_done');
                                $scope.app.slidingMenu.setMainPage('login.html', {  animation: "fade", closeMenu: true });
                            })
                            .error( function(data, status) {
                                ons.notification.alert({ title: 'Logout failed', message: 'Network Error. Please check your connection and try again.' });                
                            })
                            .finally(function() {
                                service.hideSpinner();
                            }
                        );
                    }
                }
            });
    }
    
}]);


// This is a AdminController
app.controller('AdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    $scope.thumbPath  = service.thumbPath;
    $scope.n_user     = 0;
    $scope.n_post     = 0;
    $scope.n_tag      = 0;
    $scope.n_location = 0;
    $scope.n_feed     = 0;
    $scope.n_help     = 0;

    service.cloudAPI.userCount().success( function(result, status){ $scope.n_user = result; });
    service.cloudAPI.postCount().success( function(result, status){ $scope.n_post = result; });
    service.cloudAPI.tagCount().success( function(result, status){ $scope.n_tag = result; });
    service.cloudAPI.locationCount().success( function(result, status){ $scope.n_location = result; });
    service.cloudAPI.feedCount().success( function(result, status){ $scope.n_feed = result; });
    service.cloudAPI.helpCount().success( function(result, status){ $scope.n_help = result; });

}]);

app.controller('UserAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {

    angular.extend(this, $controller('AdminController', {$scope: $scope}));
    
    service.showSpinner();
    service.cloudAPI.userList()
        .success( function(result, status){
            $scope.users = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('PostAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    angular.extend(this, $controller('AdminController', {$scope: $scope}));

    service.showSpinner();
    service.cloudAPI.postList()
        .success( function(result, status){
            $scope.posts = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('TagAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    angular.extend(this, $controller('AdminController', {$scope: $scope}));

    service.showSpinner();
    service.cloudAPI.tagList()
        .success( function(result, status){
            $scope.tags = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('LocationAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    angular.extend(this, $controller('AdminController', {$scope: $scope}));

    service.showSpinner();
    service.cloudAPI.locationList()
        .success( function(result, status){
            $scope.locations = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('FeedAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    angular.extend(this, $controller('AdminController', {$scope: $scope}));

    service.showSpinner();
    service.cloudAPI.feedList()
        .success( function(result, status){
            $scope.feeds = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('HelpAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    angular.extend(this, $controller('AdminController', {$scope: $scope}));

    service.showSpinner();
    service.cloudAPI.helpList()
        .success( function(result, status){
            $scope.help = result;
        })
        .finally(function() {
            service.hideSpinner();
        }
    );
}]);


app.controller('AboutAdminController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {

    angular.extend(this, $controller('AdminController', {$scope: $scope}));
    
    service.showSpinner();
    service.cloudAPI.aboutList()
        .success( function(result, status){
            $scope.about = result[0];
        })
        .finally(function() {
            service.hideSpinner();
        }
    );

}]);


app.controller('AboutController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {

    $scope.appName      = "Superean";
    $scope.version      = "1.0.0";
    $scope.builtDate    = new Date();
    
    service.cloudAPI.aboutList()
        .success( function(result, status){
            $scope.about = result[0];
        }
    );
    
    service.cloudAPI.helpList()
        .success( function(result, status){
            $scope.helps = result;
        })
        .error( function(){
            $scope.helps = [];
        }
    );
    
}]);

app.controller('ContactController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {

    $scope.thumbPath = service.thumbPath;
    $scope.user = service.getCurrentUser();

    if (service.isLoggined) {

        $scope.sendSupport = function() {
            if ($scope.user === undefined || $scope.user === '') {
                ons.notification.alert( {message : 'Please login to continue.'} );
                return 0;
            }
            if ($scope.subject === '') {
                return 0;
            }
            if ($scope.message === '') {
                return 0;
            }
            var data = {
                user_id     : $scope.user.user_id, 
                email       : $scope.user.email,
                subject     : $scope.subject,
                message     : $scope.message
            };
            service.showSpinner();
            service.cloudAPI.sendSupport( data )
            .success( function() {
                ons.notification.alert( {message : 'Your request has been sent successfully.'} );
            })
            .error( function() {
                ons.notification.alert( {message : 'Your request cannot be sent.'} );
            })
            .finally( function() {
                service.hideSpinner();
            });
        }
    }

}]);

app.controller('ClassifyController', ['$scope', 'service', '$http', '$q', '$controller', function($scope, service, $http, $q, $controller) {
    
    $scope.classifies = service.getClassifies();

}]);

