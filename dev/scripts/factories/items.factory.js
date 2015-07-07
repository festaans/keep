app.factory('loadItems', ['$http', function($http) {
    return $http.get('data/items.json');
}]);
