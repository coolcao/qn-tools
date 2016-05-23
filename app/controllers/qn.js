const qiniu = require('qiniu');

//七牛設置
const access_key = 'c53lCfUnng5hK1S8fH8bkkat_f_kI4qSFbrWVy2b';
const secret_key = 't2k8W5gtb5l5oH0F0HJ-DDRRbxuCi8BFPFUDQqyG';

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}
//生成token
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}

var upload = function(file_path) {
    let bucket = 'img001';
    let file_name = (new Date()).getTimes();
    uploadFile(uptoken(bucket, file_name), file_path);
}

module.exports = {
    upload: upload
};
