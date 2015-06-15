var ipc = require('ipc')
var titlebar = require('titlebar')()

if (process.platform !== 'win32') {
  titlebar.appendTo('#titlebar')
}

var isFullscreen = false

var onfullscreentoggle = function (e) {
  if (isFullscreen) {
    isFullscreen = false
    ipc.send('exit-full-screen')
  } else {
    isFullscreen = true
    ipc.send('enter-full-screen')
  }
}

titlebar.on('close', function () {
  ipc.send('close')
})

titlebar.on('minimize', function () {
  ipc.send('minimize')
})

titlebar.on('maximize', function () {
  ipc.send('maximize')
})

titlebar.on('fullscreen', onfullscreentoggle)
