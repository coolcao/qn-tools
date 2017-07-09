'use strict';

app.controller('FileUploadCtrl', ['$scope', '$http', '$localStorage','FileUploader','toaster', function($scope, $http,$localStorage, FileUploader,toaster) {
    $scope.filename = '将文件拖拽到这里进行上传';
    $scope.download_url = '';
    var uploader = $scope.uploader = new FileUploader({
        url: 'js/controllers/upload.php'
    });
    $scope.uploaded = function(arg) {
        if (arg && arg.ret == 0) {
            $scope.download_url = arg.downloadUrl;
            $scope.filename = '文件【'+$scope.file.name + '】上传成功';
            toaster.pop('success','上传成功',$scope.filename);
            $scope.$apply();

            //保存历史记录
            if(Object.prototype.toString.call($localStorage['qn.history']) != '[object Array]'){
                $localStorage['qn.history'] = [];
            }
            var _history = {
                filename:$scope.file.name,
                download_url:$scope.download_url,
                update_time:new Date()
            };
            var contains = function (array,item) {
                for(var i=0;i<array.length;i++){
                    if(array[i].download_url == item.download_url){
                        return true;
                    }
                }
                return false;
            }
            if(!contains($localStorage['qn.history'],_history)){
                $localStorage['qn.history'].push(_history);
            }

        }
    }
    $scope.authInfo = $localStorage['qn.auth'];
    uploader.onAfterAddingFile = function(fileItem) {
        var file = $scope.file = fileItem._file;
        if (file) {
            $scope.filename = '正在上传：【' + file.name + '】';
            toaster.pop('info','提示',$scope.filename);
            $scope.$apply();
            ipcRenderer.send('upload', {
                file_path: file.path,
                bucket: $scope.authInfo.bucket, 
                domain: $scope.authInfo.domain,
                md: $scope.md,
                ak: $scope.authInfo.ak,
                sk: $scope.authInfo.sk
            });

        }

    };
    ipcRenderer.on('uploaded', (event, arg) => {
        console.log('上传完成');
        $scope.uploaded(arg);
    });
}]);