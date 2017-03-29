'use strict';

app.controller('FileHistoryController', ['$scope', '$http', '$localStorage', 'toaster', '$modal', function($scope, $http, $localStorage, toaster, $modal) {
    $scope.history = $localStorage['qn.history'] || [];
    $scope.tbOptions = {
        aaData: $scope.history,
        aoColumns: [{
            mData: 'filename'
        },{
            mData:'download_url'
        }, {
            mData: 'download_url'
        }, {
            mData: 'update_time'
        }],
        aoColumnDefs: [{
            aTargets: [0],
            mRender: function(data, type, full) {
                return data;
            }
        }, {
             aTargets: [2],
             mRender:function (data,type,full) {
                return data;
             }
        },{
            aTargets: [1],
            mRender: function(data, type, full) {
                return '<img src="' + data + '"  height="88" width="88"></img>'
            }
        }]
    };

}]);