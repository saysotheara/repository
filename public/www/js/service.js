// This is a JavaScript file

app.factory('service', [ '$rootScope', '$http', '$q', function($rootScope, $http, $q) {

    var cloudAPI = new CloudAPI($http);

    var categories = [
        {id: '001', tag: 'Vehicles'},
        {id: '002', tag: 'Mobile devices'},
        {id: '003', tag: 'Houses'},
        {id: '004', tag: 'Properties'},
        {id: '005', tag: 'Books'},
        {id: '006', tag: 'Computers'},
        {id: '007', tag: 'Electronics'},
        {id: '008', tag: 'Jewelries'},
        {id: '009', tag: 'Fashions'},
        {id: '010', tag: 'Goods'},
        {id: '011', tag: 'Others'}
    ];
    var classifies = [
        {id: '001', name: 'Classify'},
        {id: '002', name: 'Business'},
        {id: '003', name: 'Service'},
        {id: '004', name: 'Product'},
        {id: '005', name: 'Store'},
        {id: '006', name: 'Annoucement'},
        {id: '007', name: 'Education'},
        {id: '008', name: 'Training'},
        {id: '009', name: 'Entertainment'},
        {id: '009', name: 'Acccomodation'},
        {id: '009', name: 'Travel'},
        {id: '009', name: 'News'},
        {id: '010', name: 'Jobs'},
        {id: '011', name: 'Others'},
        {id: '012', name: 'More ads'}
    ];

    // CurrentUser
    var CurrentUser = '';
    var setCurrentUser = function(user){
        CurrentUser = user;
    };
    var getCurrentUser = function(){        
        return CurrentUser;
    };

    return {
        srcPath     : cloudAPI.getBaseUrl() + 'src/',
        thumbPath   : cloudAPI.getBaseUrl() + 'src/thumbnail/',
        
        cloudAPI: cloudAPI,
        getCategories: function() {
            return categories;
        },        
        getClassifies: function() {
            return classifies;
        },
        isLoggined: function() {
            if (CurrentUser !== '' && CurrentUser.active === 'on') {
                return true;
            }
            else {
                return false;
            }
        },

        showSpinnerAuto: function() {
            modal.show();
            setTimeout('modal.hide()', 10000);
        },
        showSpinner: function() {
            modal.show();
        },
        hideSpinner: function() {
            modal.hide();
        },
        
        setCurrentUser: setCurrentUser,
        getCurrentUser: getCurrentUser
    };

}]);


