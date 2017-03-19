'use strict';

app.controller('TypeaheadDemoCtrl', ['$scope', '$http', '$localStorage','$state',function($scope, $http,$localStorage,$state) {
    $scope.exit = function () {
        $localStorage['qn.auth'] = null; 
        $state.go('auth');
    }
}]);