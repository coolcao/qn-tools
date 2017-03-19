'use strict';

/* Controllers */

app.controller('AuthController', ['$scope', '$http', '$localStorage','$state','toaster',function($scope, $http,$localStorage,$state,toaster) {

    if($localStorage['qn.auth']){
        $state.go('app.form');
    }

    ipcRenderer.on('authed', function(event,info) {
        if(info.ret === 0){
            $scope.saveAuth();
            $state.go('app.form');
        }else{
            console.log(JSON.stringify(info));
            toaster.pop('error','认证失败',info.msg.error);
            $scope.$apply();
        }
    });

    $scope.saveAuth = function () {
        $localStorage['qn.auth'] = $scope.auth;
    }

    $scope.goAuth = function() {
        if ($scope.auth.ak && $scope.auth.sk) {
            ipcRenderer.send('auth', $scope.auth);
        } else {
            toaster.pop('error','填写错误','填写错误');
            $scope.$apply();
        }
    }
}]);
