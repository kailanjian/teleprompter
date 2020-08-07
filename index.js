const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000
const io = require('socket.io')(server)
const path = require('path')

app.use(express.static(path.join(__dirname + '/public')))

const rooms = {};

io.on('connection', socket => {
  console.log('Some client connected');

  // initialize room from frontend
  socket.on('create_room', id => {
    rooms[id] = true;
  });

  socket.on('action', (id, action) => {
    const room = id.split('_')[0];
    const type = id.split('_')[1];

    if (type == 'controller') {
      if (action == 'activate') { 
        io.to(`${room}_host`).emit('activate');
      }
    }
  });

  // 
  socket.on('join', id => {
    console.log("join received")
    console.log(id);
    const room = id.split('_')[0];
    const type = id.split('_')[1];

    socket.join(id)
    io.to(id).emit('joined');
    console.log('Joined id: ', id)

    if (type == 'host') {
      console.log('host');
    } else if (type == 'controller') {
      console.log('controller');
    }
  });
})

app.get('/', (req, res) => {
  res.status(200).send('Working');
})

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForRoom(id) {
  let counter = 5;
  while (rooms[id.toString()] == undefined) {
    counter--;
    if (counter == 0) break;
    console.log("waited too long"); // TODO: reject here
    await sleep(1000);
  }
}

app.get('/join/:id/host', (req, res) => {
  waitForRoom(req.params.id).then(() => {
    res.sendFile('/host.html', {root: './public'});
  });
});

app.get('/join/:id/controller', (req, res) => {
  waitForRoom(req.params.id).then(() => {
    res.sendFile('/controller.html', {root: './public'});
  });
})

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})
