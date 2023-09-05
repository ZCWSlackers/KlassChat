import { API_URL } from './constants.js';
import { channelId } from './channels.js';

function fetchMessages(channelId) {
  fetch(`${API_URL}/api/messages/channel/${channelId}`)
    .then(response => response.json())
    .then(messages => {
      displayMessages(messages);
    })
    .catch(error => {
      console.error('Error fetching messages: ', error);
    });
}

function displayMessages(messages) {
  const messageBox = document.getElementById('message-box');
  messageBox.innerHTML = '';
  if (messages.length === 0) {
    messageBox.textContent = 'Send a message to start the chat!';
  } else {
    const messageList = document.createElement('ul');
    const messageTime = document.createElement('p');
    const messageSender = document.createElement('p');

    messages.forEach(message => {
      const messageItem = document.createElement('li');
      const messageTime = document.createElement('li');
      const messageSender = document.createElement('li');

      messageSender.textContent = message.user.id + ' :';
      messageItem.textContent = message.content;
      messageTime.textContent = message.timestamp;

      console.log(messageItem);
      messageList.appendChild(messageSender);
      messageList.appendChild(messageItem);
      messageList.appendChild(messageTime);
    });

    messageBox.appendChild(messageList);
  }
}

export { fetchMessages };
