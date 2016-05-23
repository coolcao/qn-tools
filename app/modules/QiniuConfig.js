var QiniuConfig = function QiniuConfig(ak, sk, bucket, domain) {
    this.access_key = ak;
    this.secret_key = sk;
    this.bucket = bucket;
    this.domain = domain;
};

exports.QiniuConfig = QiniuConfig;
