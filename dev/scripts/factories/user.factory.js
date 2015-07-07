app.factory('loadUser', ['$http', function($http) {
    return $http.get('data/user.json');
}]);
