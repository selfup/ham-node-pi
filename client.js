const socket = io
  .connect(
    'http://10.0.0.23:5000',
    {reconnect: true}
  )

const rb = socket

const makePinsIntoArray = (data) => {
  const keys = Object.keys(data)
  const values = keys.map(e => data[e])
  const newPins = keys.map((e, i) => ({num: e, gpio: values[i]}))
  Vue.set(vm.$data, 'pins', newPins)
}

rb.on('hello', (message) => {
  makePinsIntoArray(message)
})

const entry = document.querySelector('#app')

const vm = new Vue({
  el: entry,
  data() {
    return {
      pins: [],
    }
  },
  methods: {
    updatePin(power, num) {
      rb.send('updatePin', { [num]: power })      
    }
  },
  template: `
    <div>
      <h1>GPIO Statuses</h1>
      <ul>
        <li v-for='pin in pins'>
          <p>
            Pin: <strong>{{pin.num}}</strong>
            <span
              v-if='pin.gpio'
              class="pin-on"
              @click="updatePin(false, pin.num)"
            >
              {{pin.gpio}}
            </span>
            <span
              v-if='!pin.gpio'
              class="pin-off"
              @click="updatePin(true, pin.num)"
            >
              {{pin.gpio}}
            </span>
          </p>
        </li>
      </ul>
    </div>
  `
})

rb.send('initalData', (message) => {
  makePinsIntoArray(message)
})
