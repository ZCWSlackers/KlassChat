import { API_URL } from './constants.js';
import { channelId } from './channels.js';
//import { userFirstName } from './sendingmessage.js';

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
    //    console.log(userJson);
    return userJson;
  } catch (error) {
    console.log('Error Fetching User JSON');
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
//
//async function displayMessages(messages) {
//  const messageBox = document.getElementById('message-box');
//  messageBox.innerHTML = '';
//  if (messages.length === 0) {
//    messageBox.textContent = 'Send a message to start the chat!';
//  } else {
//    const messageList = document.createElement('ul');
//    messageList.classList.add('message-list'); // For the styles.css
//
//    for (const message of messages) {
//      const messageItem = document.createElement('li');
//      const messageTime = document.createElement('li');
//      const messageSender = document.createElement('li');
//      const emptySpace = document.createElement('li');
//
//      //      console.log(message.user.id);
//      try {
//        const userData = await fetchUser(message.user.id);
//        //        console.log(userData);
//
//        messageSender.textContent = userData.firstName + ' :';
//        messageItem.textContent = message.content;
//        messageTime.textContent = message.timestamp + '\n';
//        emptySpace.textContent = '  ';
//
//        //        console.log(messageSender.textContent);
//        messageList.appendChild(messageSender);
//        messageList.appendChild(messageItem);
//        messageList.appendChild(messageTime);
//        messageList.appendChild(emptySpace);
//      } catch (error) {
//        console.error('Error fetching user data: ', error);
//      }
//    }
//    messageBox.appendChild(messageList);
//  }
//}
async function fetchMessages(channelId) {
  try {
    const response = await fetch(`${API_URL}/api/messages/channel/${channelId}`);
    const messages = await response.json();
    const messageBox = document.querySelector('.messageBox');
    messageBox.innerHTML = '';

    for (const message of messages) {
      const userData = await fetchUser(message.user.id);
      const userName = userData.firstName;
      const profilePic = message.profilePicture || 'assets/smile.png';
      const timeStamp = message.timestamp || 'Not Available';
      const spacer = ' ';

      const messageBlock = document.createElement('article');
      messageBlock.classList.add('feed');

      messageBlock.innerHTML = `
        <section class="feed-user-pic">
          <img src="${profilePic}" alt="${userName}'s Profile Picture" width="40">
          <span>${userName.charAt(0)}</span>
        </section>
        <section class="feed-message-content">
          <section class="feed-user-info">
            <h4>${userName} <span class="time-stamp">${timeStamp}</span></h4>
          </section>
          <div>
            <p class="feed-text">${message.content}</p>
            <h5> ${spacer} </h5
          </div>
        </section>
      `;

      messageBox.appendChild(messageBlock);
    }
  } catch (error) {
    console.error('Error fetching messages: ', error);
  }
}

export { fetchMessages };
