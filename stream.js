// var fs = require('fs')
var path = require('path')
var prettyBytes = require('pretty-bytes')
var pump = require('pump')
var rangeParser = require('range-parser')
var WebTorrent = require('webtorrent')
var http = require('http')

var util = require('./util')

var EventEmitter = require('events').EventEmitter

module.exports = new EventEmitter()

global.WEBTORRENT_ANNOUNCE = [ 'ws://tracker.fastcast.nz' ]

var client = new WebTorrent()

client.add(magnetUri, onTorrent)

function onTorrent (torrent) {
  var torrentFileName = path.basename(torrent.name, path.extname(torrent.name)) + '.torrent'

  util.log(
    '<a class="btn btn-primary btn-xs disabled" href="' + torrent.magnetURI + '" role="button"><i class="fa fa-magnet"></i> Magnet URI</a> ' +
    '<a class="btn btn-primary btn-xs disabled" href="' + torrent.torrentFileURL + '" target="_blank" download="' + torrentFileName + '" role="button"><i class="fa fa-download"></i> Download .torrent</a> ' +
    '<a id="downloadButton" class="btn btn-primary btn-xs disabled" role="button"><i class="fa fa-download"></i> Download ' + torrent.name + '</a> ' +
    '<a id="airplay" class="btn btn-primary btn-xs" role="button"><i class="fa fa-share"></i> AirPlay</a>'
  ) // TODO enable more buttons

  function updateSpeed () {
    var progress = (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1)
    util.updateSpeed(
      '<b>Peers:</b> ' + torrent.swarm.wires.length + ' ' +
      '<b>Progress:</b> ' + progress + '% ' +
      '<b>Download speed:</b> ' + prettyBytes(client.downloadSpeed()) + '/s ' +
      '<b>Upload speed:</b> ' + prettyBytes(client.uploadSpeed()) + '/s'
    )
    // var progressBar = document.getElementById('progressBar')
    // progressBar.setAttribute('aria-valuenow', progress)
    // progressBar.setAttribute('style', 'width: ' + progress + '%')
  }

  // progressBar.classList.add('active')

  torrent.swarm.on('download', updateSpeed)
  torrent.swarm.on('upload', updateSpeed)
  setInterval(updateSpeed, 5000)
  updateSpeed()

  torrent.files.forEach(function (file) {
    // Got torrent metadata!
    console.log(torrent.infoHash)

    // Let's say the first file is a webm (vp8) or mp4 (h264) video...
    module.exports.file = torrent.files[0]

    // Stream each file to the disk
    // var source = file.createReadStream()
    // var destination = fs.createWriteStream(__dirname + '/downloads/' + file.name)
    // source.pipe(destination)

    var server = http.createServer(function (req, res) {
        if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

        if (!file) {
          res.statusCode = 404
          res.end()
          return
        }

        var range = req.headers.range && rangeParser(file.length, req.headers.range)[0]

        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Type', 'video/mp4')

        if (!range) {
          res.setHeader('Content-Length', file.length)
          if (req.method === 'HEAD') return res.end()
          pump(file.createReadStream(), res)
          return
        }

        res.statusCode = 206
        res.setHeader('Content-Length', range.end - range.start + 1)
        res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
        if (req.method === 'HEAD') return res.end()
        pump(file.createReadStream(range), res)
    }).listen(8000) // TODO use random port

    module.exports.emit('ready')
  })
}
