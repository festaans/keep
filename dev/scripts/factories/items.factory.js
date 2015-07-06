app.factory('loadItems', function($http) {
    return $http.get('data/items.json');
});
