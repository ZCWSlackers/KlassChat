import { API_URL } from './constants.js';

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

    messages.forEach(message => {
      const messageItem = document.createElement('li');
      messageItem.textContent = message.content;
      console.log(messageItem);
      messageList.appendChild(messageItem);
    });

    messageBox.appendChild(messageList);
  }
}

export { fetchMessages };
