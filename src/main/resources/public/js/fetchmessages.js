import { API_URL } from './constants.js';
import { channelId } from './channels.js';
//import { userFirstName } from './sendingmessage.js';

//async function fetchUser(id) {
//  fetch(`${API_URL}/api/users/${id}`, {
//    method: 'GET',
//    headers: {
//      Accept: 'application/json',
//    },
//  })
//    .then(response => {
//      if (!response.ok) {
//        throw new Error('Network response was not ok');
//      }
//      return response.json();
//    })
//    .then(data => {
//      // Log the JSON data
//      console.log(JSON.stringify(data));
//      userFirstName = data.firstName;
////      console.log(userFirstName);
//
//      // Do something with the data, for example, update the UI
//      // You can access the JSON data as 'data' here
//      return data;
//      // Or return this as is
//    })
//    .catch(error => {
//      console.error('Error:', error);
//      // Handle the error, e.g., display an error message to the user
//    });
//}

async function fetchUser(id) {
  try {
    let userResponse = await fetch(`${API_URL}/api/users/${id}`, {
      // Get the response of the fetch
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    let userJson = await userResponse.json(); // Getting the JSON Body out of the Response
    console.log(userJson);
    return userJson;
  } catch (error) {
    console.log('HEY SOMETHING WENT WRONG');
  }
}

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

async function displayMessages(messages) {
  const messageBox = document.getElementById('message-box');
  messageBox.innerHTML = '';
  if (messages.length === 0) {
    messageBox.textContent = 'Send a message to start the chat!';
  } else {
    const messageList = document.createElement('ul');
    messageList.classList.add('message-list'); // For the styles.css

    for (const message of messages) {
      const messageItem = document.createElement('li');
      const messageTime = document.createElement('li');
      const messageSender = document.createElement('li');
      const emptySpace = document.createElement('li');

      console.log(message.user.id);
      try {
        const userData = await fetchUser(message.user.id);
        //        console.log(userData);

        messageSender.textContent = userData.firstName + ' :';
        messageItem.textContent = message.content;
        messageTime.textContent = message.timestamp + '\n';
        emptySpace.textContent = ' ';

        //        console.log(messageSender.textContent);
        messageList.appendChild(messageSender);
        messageList.appendChild(messageItem);
        messageList.appendChild(messageTime);
        messageList.appendChild(emptySpace);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }

    messageBox.appendChild(messageList);
  }
}

export { fetchMessages };
