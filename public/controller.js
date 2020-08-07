const socket = io()

const room = window.location.href.split('/')[window.location.href.split('/').length - 3];
let roomJoined = false;

console.log(`joining ${room}_controller`);

socket.emit('join', `${room}_controller`);

socket.on('joined', () => {
  roomJoined = true;
  console.log('joined room as controller');
})

socket.on('message', message => {
  const textarea = document.querySelector('#textarea');
  textarea.textContent = message;
  console.log('From server: ', message);
});

document.querySelector('#activate').addEventListener('click', () => {
  socket.emit('action', `${room}_controller`, 'activate')
});