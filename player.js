var stream = require('../stream')

stream.on('ready', function() {
  var file = stream.file

  // Create a video element
  var player = document.getElementById('player')
  var video = document.createElement('video')
  video.controls = true
  player.appendChild(video)
  video.setAttribute('style', 'width: 100%')

  // Stream the video into the video tag
  var src = document.createElement('source')
  console.log('agitation-new-zealand-4k.mp4')
  src.setAttribute('src', 'http://127.0.0.1:8000')
  src.setAttribute('type', 'video/mp4')
  video.appendChild(src)
  video.load()

  // AirPlay
  document.getElementById('airplay').onclick = function() {
    var browser = require( 'airplay-js' ).createBrowser()
    browser.on( 'deviceOn', function( device ) {
        device.play( 'http://127.0.0.1:8000', 0, function() {
            console.info( 'video playing...' )
        })
    })
    browser.start(); // TODO add chromecast and media players
  }

  // TODO download video properly
  // document.getElementById('downloadButton').onclick = function() {
  //   var download = document.getElementById('download')
  //   download.classList.remove('hidden')
  //
  //   // Get a url for each file
  //   file.getBlobURL(function (err, url) {
  //     if (err) return util.error(err)
  //
  //     // Hide download progress
  //     download.classList.add('hidden')
  //     var progress = document.getElementById('progress')
  //     progress.classList.add('hidden')
  //
  //     // Add a link to the page
  //     var a = document.createElement('a')
  //     a.download = file.name
  //     a.href = url
  //     download.appendChild(a)
  //     a.click()
  //     window.URL.revokeObjectURL(url)
  //   })
  // }
})
