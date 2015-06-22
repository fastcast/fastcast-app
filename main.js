var app = require('app') // Module to control application life.
var BrowserWindow = require('browser-window') // Module to create native browser window.
var ipc = require('ipc')

var frame = process.platform === 'win32'

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {

  // Create the browser window.
  win = new BrowserWindow({
    title: 'Fastcast',
    width: 800,
    height: 600,
    frame: frame,
    'web-preferences': {
      'overlay-scrollbars': true
    }
  })

  // and load the index.html of the app.
  win.loadUrl('file://' + __dirname + '/index.html')

  ipc.on('close', function () {
    app.quit()
  })

  ipc.on('minimize', function () {
    win.minimize()
  })

  ipc.on('maximize', function () {
    win.maximize()
  })

  ipc.on('resize', function (e, message) {
    if (win.isMaximized()) return
    var wid = win.getSize()[0]
    var hei = (wid / message.ratio) | 0
    win.setSize(wid, hei)
  })

  ipc.on('enter-full-screen', function () {
    win.setFullScreen(true)
  })

  ipc.on('exit-full-screen', function () {
    win.setFullScreen(false)
    win.show()
  })
})
