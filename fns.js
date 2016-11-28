const state = require('./state')

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
    slice.map(e => e.split('=')).forEach(e => values[e[0]] = e[1])
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
    appStateUpdater(newSlice, newValues, sliceNumber)
  })

const sliceToChannel = (slice) => {
  const slcAtn = slice['txant']
  const frq = +slice['RF_frequency']
  const antToPin = state.antennaPayloadKey[slcAtn]
  if (state.validAtennas[slcAtn] && frq >= 3.5) state.payload[antToPin] = false
  if (state.validAtennas[slcAtn] && frq < 3.5) state.payload[antToPin] = true
}

const runSlices = () => {
  if (state.appSlices) {
    if (Object.keys(state.appSlices).length > 0) {
      for (const [sliceNum, sliceInfo] of Object.entries(state.appSlices)) {
        if (sliceInfo["tx"] == "1") sliceToChannel(sliceInfo)
      }
    }
  }
}

const openChannelPayloadPrinter = (payload) => {
  // console.log("17: " + payload['17'])
  // console.log(new Date() + "\n");
  return null
}

module.exports = {
  state,
  formatIt,
  txSlices,
  appStateUpdater,
  sliceFormatter,
  sliceToChannel,
  runSlices,
  openChannelPayloadPrinter,
}
