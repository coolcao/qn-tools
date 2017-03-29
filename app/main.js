const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

//引入node模塊
const fs = require('fs');
const QNTool = require('./services/qn');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function initMenu() {
    const Menu = electron.Menu;
    let template = [{
        label: "Application",
        submenu: [{
            label: "About Application",
            selector: "orderFrontStandardAboutPanel:"
        }, {
            type: "separator"
        }, {
            label: "Quit",
            accelerator: "Command+Q",
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: "Edit",
        submenu: [{
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            selector: "undo:"
        }, {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            selector: "redo:"
        }, {
            type: "separator"
        }, {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            selector: "cut:"
        }, {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        }, {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        }, {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
        }]
    },{
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  }];


    //注册菜单 
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/public/index.html`)

    const ses = mainWindow.webContents.session;
    ses.cookies.set({
        url: 'http://coolcao.com/qn-tools',
        name: 'name',
        value: 'coolcao'
    }, (err) => {
        if (err) {
            console.log(err);
        }
        ses.cookies.get({
            url: 'http://coolcao.com/qn-tools'
        }, (err, cookies) => {
            console.log(cookies);
        });
    });


    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    initMenu();
}



ipcMain.on('upload', (event, form) => {
    if (!form) {
        return event.sender.send('uploaded', {
            ret: 500,
            msg: '文件为空'
        });
    }
    let qnTool = new QNTool(form.ak, form.sk, form.bucket, form.domain);
    console.log(form);
    qnTool.upload(form.file_path, form.md).then(result => {
        console.log(`文件上传成功！${result.downloadUrl}`);
        event.sender.send('uploaded', {
            ret: 0,
            downloadUrl: result.downloadUrl
        });
    });

});

ipcMain.on('auth', (event, authInfo) => {
    let qnTool = new QNTool(authInfo.ak, authInfo.sk, authInfo.bucket, authInfo.domain);
    if (!authInfo) {
        return event.sender.send('authed', {
            ret: 500,
            msg: '认证失败，auth信息不能为空'
        });
    }

    qnTool.upload(`${__dirname}/public/img/a0.jpg`, 'auth').then(result => {
        console.log(result);
        if (result.downloadUrl) {
            event.sender.send('authed', {
                ret: 0,
                msg: 'auth success'
            });
        }
    }).catch(err => {
        console.log(err);
        event.sender.send('authed', {
            ret: 500,
            msg: err.message || err
        });
    });


});

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg);  // prints "ping"
//   event.returnValue = 'pong';
// });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.