/**
  vue app below
*/

const makePinsIntoArray = (data) => {
  const keys = Object.keys(data)
  const values = keys.map(e => data[e])
  const newPins = keys.map((e, i) => ({num: e, gpio: values[i]}))
  Vue.set(vm.$data, 'pins', newPins)
}

const entry = document.querySelector('#app')

const vm = new Vue({
  el: entry,
  data() {
    return {
      pins: [],
    }
  },
  template: `
    <div>
      <h1>GPIO Statuses</h1>
      <ul>
        <li v-for='pin in pins'>
          <h1>
            Pin: {{pin.num}}
            <span
              v-if='pin.gpio'
              class="pin-on"
            >
              {{pin.gpio}}
            </span>
            <span
              v-if='!pin.gpio'
              class="pin-off"
            >
              {{pin.gpio}}
            </span>
          </h1>
        </li>
      </ul>
    </div>
  `
})

/**
  web socket logic below
*/

const socket = io
  .connect(
    'http://10.0.0.230:5000',
    {reconnect: true}
  )

const rb = socket

rb.on('hello', message => makePinsIntoArray(message))

rb.send('initalData', message => makePinsIntoArray(message))
