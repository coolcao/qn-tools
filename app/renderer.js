const {
    ipcRenderer
} = require('electron');
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

const holder = document.getElementById('holder');
holder.ondragover = () => {
    return false;
};
holder.ondragleave = holder.ondragend = () => {
    return false;
};
var submit = function submit(e) {
    console.log('submit');
    let file = e.dataTransfer.files[0];
    let file_path = file.path;
    let bucket = document.getElementById('bucket') && document.getElementById(
        'bucket').value;
    let ak = document.getElementById('access_key') && document.getElementById(
        'access_key').value;
    let sk = document.getElementById('secret_key') && document.getElementById(
        'secret_key').value;
    let domain = document.getElementById('domain') && document.getElementById(
        'domain').value;
    let md = document.getElementById('module').value;
    if (!file) {
        return document.getElementById('holder').innerText = '文件不能爲空';
    }
    if (!bucket) {
        // return document.getElementById('bucket').placeholder = 'bucket不能爲空';
        bucket = 'img001';
    }
    if (!ak) {
        // return document.getElementById('access_key').placeholder =
        //     'access_key不能爲空';
        ak = 'c53lCfUnng5hK1S8fH8bkkat_f_kI4qSFbrWVy2b';
    }
    if (!sk) {
        // return document.getElementById('secret_key').placeholder =
        //     'secret_key不能爲空';
        sk = 't2k8W5gtb5l5oH0F0HJ-DDRRbxuCi8BFPFUDQqyG';
    }
    if (!domain) {
        domain = '7xt3oh.com2.z0.glb.clouddn.com';
    }

    document.getElementById('file_path').innerText = file.path;
    ipcRenderer.send('upload', {
        file_path: file_path,
        bucket: bucket,
        domain: domain,
        md: md,
        ak: ak,
        sk: sk
    });
}
holder.ondrop = (e) => {
    e.preventDefault();
    submit(e);
    return false;
};

ipcRenderer.on('uploaded', (event, arg) => {
    console.log('上傳完成');
    console.log(arg);
    if (arg && arg.ret === 0) {
        document.getElementById('img').setAttribute('src', arg.downloadUrl);
        document.getElementById('file_url').innerText = arg.downloadUrl
    }
});
