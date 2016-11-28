const net = require('net')
const http     = require('http')
const socketIo = require('socket.io')
const port     = process.env.PORT || 5000

const server = http.createServer()
  .listen(port, () => {
  console.log(`Listening on port ${port}.`)
})

const {
  state,
  formatIt,
  txSlices,
  appStateUpdater,
  sliceFormatter,
  sliceToChannel,
  runSlices,
  openChannelPayloadPrinter
} = require('./fns')

const sendPayload = (payload) => {
  openChannelPayloadPrinter(payload)
  const rpi = new net.Socket()
  rpi.connect(2000, '10.0.0.230', () => {
    rpi.write(JSON.stringify(payload))
    rpi.end()
    rpi.destroy()
  })
}

const io = socketIo(server)

io.sockets.on('connection', socket => {
  const flex = new net.Socket()
  flex.connect(4992, '10.0.0.18')
  flex.write("c1|sub slice all\n")
  flex.on('data', function(data) {
    const firstFormat = formatIt(data.toString('utf8'))
    const inboundSlices = txSlices(firstFormat)
    sliceFormatter(inboundSlices)
    runSlices()
    sendPayload(state.payload)
    socket.emit('hello', state.payload)
  })
  flex.on('close', function() {
  	console.log('Connection closed')
  })
  socket.on('message', (channel, message) => {
    if (channel === 'createTable') {
      socket.emit('hello', state.payload)
    }
  })
})