app.controller('manojController',['$scope', 'loadUser', 'loadItems', function($scope, loadUser, loadItems) {

  //set doc title
  window.document.title = 'UI Challenge 2';

  $scope.user = "";
  $scope.items = "";

  loadUser.success(function(data) {
      $scope.user = data.user;
  });

  loadItems.success(function(data) {
      $scope.items = data.items;
  });

}]);
