const socket = io.connect('http://10.0.0.230:5000', {reconnect: true})

const rb = socket

const test = () => {
  rb.send('createTable', "lol")
}

test()

rb.on('hello', (message) => {
  console.log(message);
})
