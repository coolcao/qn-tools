const qiniu = require('qiniu');
const QiniuConfig = require('../modules/QiniuConfig.js');

//七牛設置
const access_key = 'c53lCfUnng5hK1S8fH8bkkat_f_kI4qSFbrWVy2b';
const secret_key = 't2k8W5gtb5l5oH0F0HJ-DDRRbxuCi8BFPFUDQqyG';


qiniu.conf.ACCESS_KEY = access_key;
qiniu.conf.SECRET_KEY = secret_key;

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
function uploadFile(uptoken, key, localFile, callback) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        callback(err, ret);
    });
}

var downloadUrl = function(key, domain) {
    let policy = new qiniu.rs.GetPolicy();
    let url = 'http://' + domain + '/' + key;
    // let dl = policy.makeRequest(url);
    return url;
}

var upload = function(form, callback) {
    let bucket = form.bucket;
    let ak = form.ak;
    let sk = form.sk;
    let file_path = form.file_path;
    let domain = form.domain;
    let md = form.md;
    let file_name = file_path.split('/').slice(-1)[0];
    if (md) {
        file_name = md + '/' + file_name;
    }
    uploadFile(uptoken(bucket, file_name), file_name, file_path, (err,
        result) => {
        if (err) {
            callback(err);
        } else {
            let _dl = downloadUrl(result.key, domain);
            callback(err, {
                downloadUrl: _dl
            });
        }
    });
}

module.exports = {
    upload
};
