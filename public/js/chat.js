const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messagesContainer = document.querySelector('#messages');
const $locationButton = document.querySelector('#send-location');
const $sidebarContainer = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const autoScroll = function () {
  const $newMsg = $messagesContainer.lastElementChild;

  const newMsgStyles = getComputedStyle($newMsg);
  const newMsgMargin = parseInt(newMsgStyles.marginBottom);
  const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;

  const visibleHeight = $messagesContainer.offsetHeight;

  const containerHeight = $messagesContainer.scrollHeight;

  const scrollOffset = $messagesContainer.scrollTop + visibleHeight;

  if (containerHeight - newMsgHeight <= scrollOffset) {
    $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
  }
};

const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', (messageObj) => {
  const html = Mustache.render(messageTemplate, {
    username: messageObj.username,
    message: messageObj.message,
    createdAt: moment(messageObj.createdAt).format('HH:mm:ss'),
  });
  $messagesContainer.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('locationMessage', (locationObj) => {
  const html = Mustache.render(locationTemplate, {
    username: locationObj.username,
    url: locationObj.url,
    createdAt: moment(locationObj.createdAt).format('HH:mm:ss'),
  });
  $messagesContainer.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  $sidebarContainer.innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', true);

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (msg) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    msg && alert(msg);
  });
});

$locationButton.addEventListener('click', () => {
  $locationButton.setAttribute('disabled', true);

  if (!navigator.geolocation) {
    return alert('Your browser does not support geolocation!');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    socket.emit('sendLocation', { latitude, longitude }, () => {
      $locationButton.removeAttribute('disabled');
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);

    location.href = '/';
  }
});
