const qiniu = require('qiniu');
const QiniuConfig = require('../modules/QiniuConfig.js');

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
    return new Promise((resolve,reject) => {
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(err){
                reject(err);
            }else{
                resolve(ret);
            }
        });
    });

}

var downloadUrl = function(key, domain) {
    let policy = new qiniu.rs.GetPolicy();
    let url = 'http://' + domain + '/' + encodeURI(key);
    // let dl = policy.makeRequest(url);
    return url;
}

class QNTool {
    constructor(ak,sk,bucket,domain){
        this.ak = ak;
        this.sk = sk;
        this.bucket = bucket;
        this.domain = domain;
        qiniu.conf.ACCESS_KEY = ak;
        qiniu.conf.SECRET_KEY = sk;
    }

    /**
    * file_path:文件本地路径
    * md:类别，其实就是文件名前缀而已
    */
    upload(file_path,md){

        let bucket = this.bucket;
        let ak = this.ak;
        let sk = this.sk;
        let domain = this.domain;
        let file_name = file_path.split('/').slice(-1)[0];
        if (md) {
            file_name = md + '/' + file_name;
        }

        return uploadFile(uptoken(bucket,file_name),file_name,file_path).then(result => {
            let _dl = downloadUrl(result.key, domain);
            return {downloadUrl:_dl};
        })

    }
}



module.exports = QNTool;
