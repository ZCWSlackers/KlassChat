import { API_URL } from './constants.js';
import { channelId } from './channels.js';
//import { userFirstName } from './sendingmessage.js';

//use the function here again and populate the user names

let userFirstName = null;
let userLastName = null;
let userLogin = null;

function userId() {
  try {
    var url_string = window.location.href.toLowerCase();
    var url = new URL(url_string);
    var userid = url.searchParams.get('userid');
    // var geo = url.searchParams.get("geo");
    // var size = url.searchParams.get("size");
    console.log(userid);
    return userid;
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return '0';
  }
}

function fetchUser(id) {
  fetch(`${API_URL}/api/users/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Log the JSON data
      console.log(JSON.stringify(data));
      userFirstName = data.firstName;
      userLastName = data.lastName;
      userLogin = data.login;
      console.log(userFirstName);

      return data;
      // Or return this as is
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error, e.g., display an error message to the user
    });
}

let sendingUser = userId();

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
    const emptySpace = document.createElement('p');

    messages.forEach(message => {
      const messageItem = document.createElement('li');
      const messageTime = document.createElement('li');
      const messageSender = document.createElement('li');
      const emptySpace = document.createElement('li');
      const messageUserId = message.user.id;

      let temp = fetchUser(messageUserId);
      console.log(userFirstName);
      messageSender.textContent = userFirstName + ' :';
      messageItem.textContent = message.content;
      messageTime.textContent = message.timestamp;
      emptySpace.textContent = ' ';

      console.log(messageSender.textContent);
      messageList.appendChild(messageSender);
      messageList.appendChild(messageItem);
      messageList.appendChild(messageTime);
      messageList.appendChild(emptySpace);
    });

    messageBox.appendChild(messageList);
  }
}

export { fetchMessages };
