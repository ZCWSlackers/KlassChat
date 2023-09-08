import { API_URL } from './constants.js';

function fetchMessages(channelId) {
  fetch(`${API_URL}/api/messages/channel/${channelId}`)
    .then(response => response.json())
    .then(messages => {
      const messageBox = document.querySelector('.messageBox');
      messageBox.innerHTML = '';

      messages.forEach(message => {
        const userName = message.username || 'Unknown User';
        const profilePic = message.profilePicture || 'assets/smile.png';
        const timeStamp = message.timestamp || 'Not Available';

        const messageBlock = document.createElement('article');
        messageBlock.classList.add('feed');

        // this is causing the problem I think
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
          </div>
        </section>
    `;
        messageBox.appendChild(messageBlock);
      });
    })
    .catch(error => {
      console.error('Error fetching messages: ', error);
    });
}

// function displayMessages(messages) {
//   const messageBox = document.getElementById('message-box');
//   messageBox.innerHTML = '';
//   if (messages.length === 0) {
//     messageBox.textContent = 'Send a message to start the chat!';
//   } else {
//     const messageList = document.createElement('ul');
//
//     messages.forEach(message => {
//       const messageItem = document.createElement('li');
//       messageItem.textContent = message.content;
//       console.log(messageItem);
//       messageList.appendChild(messageItem);
//     });
//
//     messageBox.appendChild(messageList);
//   }
// }

export { fetchMessages };
