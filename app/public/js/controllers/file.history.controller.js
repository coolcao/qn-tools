'use strict';

app.controller('FileHistoryController', ['$scope', '$http', '$localStorage','toaster', function($scope, $http,$localStorage, toaster) {
    $scope.history = $localStorage['qn.history'] || [];
    console.log($scope.history);
}]);