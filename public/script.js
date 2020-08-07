const socket = io()

const chat = document.querySelector('.chat-form')
const Input = document.querySelector('.chat-input')

const button = document.querySelector('#start');

const room = undefined;

button.addEventListener('click', e => {
  e.preventDefault();
  const id = Math.floor(Math.random() * 1000000000);
  socket.emit('create_room', id.toString())
  document.location.href = `/join/${id}/host/`
});

// chat.addEventListener('submit', event => {
//   event.preventDefault();
//   socket.emit('chat', Input.value);
//   Input.value = '';
// });

socket.on('chat', message => {
  console.log('From server: ', message);
});

socket.on('message', message => {
  console.log('From server: ', message);
});