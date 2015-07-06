app.controller('overviewController',['$scope', 'loadUser', 'loadItems', function($scope, loadUser, loadItems) {
  $scope.user = "";
  $scope.items = "";

  loadUser.success(function(data) {
      $scope.user = data.user;
  });

  loadItems.success(function(data) {
      $scope.items = data.items;
  });

}]);
