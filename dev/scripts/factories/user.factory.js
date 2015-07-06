app.factory('loadUser', function($http) {
    return $http.get('data/user.json');
});
