const net = require('net')
const http = require('http')
const socketIo = require('socket.io')

const port = process.env.PORT || 5000
const server = http.createServer().listen(port, () => null )

const {
  state,
  formatIt,
  txSlices,
  appStateUpdater,
  sliceFormatter,
  sliceToChannel,
  runSlices,
} = require('./fns')

const sendPayload = (payload) => {
  const payloadToParams = Object
    .keys(payload)
    .map((pin) => {
      return `${pin}=${payload[pin]}`
    })

  const endpoint = `localhost:9292/set?${payloadToParams}`

  http
    .get('http://' + endpoint, (res) => {
      console.log(res.body)
    })
}

const io = socketIo(server)

const socketTracker = {
  socket: {
    emit: (one, two) => null
  }
}

// const flex = new net.Socket()
// flex.connect(4992, '10.0.0.18')
// flex.write("c1|sub slice all\n")
// flex.on('close', function() { return null } )
// flex.on('data', function(data) {
  // const firstFormat = formatIt(data.toString('utf8'))
  // const inboundSlices = txSlices(firstFormat)
  // sliceFormatter(inboundSlices)
  // runSlices()
  // sendPayload(state.payload)
  // socketTracker.socket.emit('hello', state.payload)
// })

io.sockets.on('connection', socket => {
  socketTracker['socket'] = socket
  socket.on('message', (channel, message) => {
    switch(channel) {
      case 'initalData':
        socket.emit('hello', state.payload)
        break
      case 'updatePin':
        sendPayload(message)
        Object.assign(state.payload, message)
        socket.emit('hello', state.payload)
        break
      default:
        null
        break
    }
  })
})
