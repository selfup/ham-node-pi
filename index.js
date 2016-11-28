const net = require('net')
const state = require('./state')

const sendPayload = (payload) => {
  const rpi = new net.Socket()
  rpi.connect(2000, '10.0.0.230', () => {
    rpi.write(JSON.stringify(payload))
    rpi.end()
    rpi.destroy()
  })
}

const formatIt = msg => msg
  .split("\n").map(e => e.split(' ')).map((e) => {
    const key = e[0]
    e.shift
    return ({key: key, value: e})
  })

const txSlices = response => response
  .map(e => {
    const key = e['key']
    const value = e['value']
    if (key.split('|')[1] === "slice") return ({slice: value})
    return value
  })
  .filter(e => e !== 0)

const appStateUpdater = (slice, values, num) => {
  if (typeof slice !== 'string') {
    slice
      .map(e => e.split('='))
      .forEach(e => values[e[0]] = e[1])

    if (!Object.keys(state.appSlices).includes(num)) {
      state.appSlices[num] = values
    } else {
      Object.assign(state.appSlices[num], values)
    }
  }
}

const sliceFormatter = slices => slices
  .map(slice => {
    const newValues = {}
    const newSlice =  Object.keys(slice).map(e => slice[e])[0]
    const sliceNumber = newSlice[1]
    newSlice.shift
    newSlice.shift
    appStateUpdater(newSlice, newValues, sliceNumber)
  })

const sliceToChannel = (slice) => {
  const sliceAntenna = slice['txant']
  const freq = slice['RF_frequency']
  console.log(sliceAntenna);
  const antToGPIO = state.antennaPayloadKey[sliceAntenna]
  console.log(+freq < 3.5);
  if (state.validAtennas[sliceAntenna] && +freq >= 3.5) state.payload[antToGPIO] = false
  if (state.validAtennas[sliceAntenna] && +freq < 3.5) state.payload[antToGPIO] = true
}

const runSlices = () => {
  if (state.appSlices) {
    if (Object.keys(state.appSlices).length > 0) {
      for (let [sliceNum, sliceInfo] of Object.entries(state.appSlices)) {
        if (sliceInfo["tx"] == "1") {
          sliceToChannel(sliceInfo)
        }
      }
    }
  }
}

const flex = new net.Socket()
flex.connect(4992, '10.0.0.18')

flex.write("c1|sub slice all\n")

flex.on('data', function(data) {
  const firstFormat = formatIt(data.toString('utf8'))
  const inboundSlices = txSlices(firstFormat)
  sliceFormatter(inboundSlices)
  runSlices()
  console.log(state.payload);
  sendPayload(state.payload)
})

flex.on('close', function() {
	console.log('Connection closed')
})
