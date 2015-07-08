app.controller('keitumetseController',['$scope', 'loadUser', 'loadItems', function($scope, loadUser, loadItems) {

  $scope.user = "";
  $scope.items = "";
  $scope.selectedItems = [];
  $scope.selectedItemsCount =  ($scope.selectedItems).length;

  loadUser.success(function(data) {
      $scope.user = data.user;
  });

  loadItems.success(function(data) {
      $scope.items = data.items;
  });

  $scope.selectItem = function(index){
    $scope.selectedItems.push(index);
    updateCounter();
  };

  function updateCounter() {
    $scope.selectedItemsCount =  ($scope.selectedItems).length;
    console.log($scope.selectedItems);
  }

}]);
