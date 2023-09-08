import { API_URL } from './constants.js';

function fetchMessages(channelId) {
  fetch(`${API_URL}/api/messages/channel/${channelId}`)
    .then(response => response.json())
    .then(messages => {
      const messageBox = document.querySelector('.messageBox');

      // Clear any existing messages in the messageBox
      messageBox.innerHTML = '';

      // Iterate through the messages and create an article for each one
      messages.forEach(message => {
        // Add default values for userName and userPic if they are missing or undefined
        const userName = message.userName || 'Unknown User';
        const userPic = message.profilePic || 'assets/smile.png';

        const timestamp = new Date(message.timestamp);
        const formattedTimestamp = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;

        const article = document.createElement('article');
        article.classList.add('message-feed');

        // Create the feed-user-pic section
        const userPicSection = document.createElement('section');
        userPicSection.classList.add('feed-user-pic');
        const userPicImg = document.createElement('img');
        userPicImg.src = userPic;
        userPicImg.alt = userName;
        userPicImg.width = 40;
        const userNameInitial = document.createElement('span');
        userNameInitial.textContent = userName.charAt(0);
        userPicSection.appendChild(userPicImg);
        userPicSection.appendChild(userNameInitial);

        // Create the feed-message-content section
        const messageContentSection = document.createElement('section');
        messageContentSection.classList.add('feed-message-content');

        // Create the feed-user-info section
        const userInfoSection = document.createElement('section');
        userInfoSection.classList.add('feed-user-info');
        const userNameHeader = document.createElement('h4');
        userNameHeader.textContent = userName;
        const timeStampSpan = document.createElement('span');
        timeStampSpan.classList.add('time-stamp');
        timeStampSpan.textContent = formattedTimestamp;
        userNameHeader.appendChild(timeStampSpan);
        userInfoSection.appendChild(userNameHeader);

        // Create the feed-text paragraph
        const messageText = document.createElement('p');
        messageText.classList.add('feed-text');
        messageText.textContent = message.content;

        // Append everything to the messageContentSection
        messageContentSection.appendChild(userInfoSection);
        messageContentSection.appendChild(messageText);

        // Append the userPicSection and messageContentSection to the article
        article.appendChild(userPicSection);
        article.appendChild(messageContentSection);

        // Append the article to the messageBox
        messageBox.appendChild(article);
      });
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
}

// function fetchMessages(channelId) {
//   fetch(`${API_URL}/api/messages/channel/${channelId}`)
//     .then(response => response.json())
//     .then(messages => {
//       const messageBox = document.querySelector('.messageBox');
//       messageBox.innerHTML = '';
//
//       messages.forEach(message => {
//         const userName = message.username || 'Unknown User';
//         const profilePic = message.profilePicture || 'assets/smile.png';
//         const timeStamp = message.timestamp || 'Not Available';
//
//         const messageBlock = document.createElement('article');
//         messageBlock.classList.add('feed');
//
//         // this is causing the problem I think
//         messageBlock.innerHTML = `
//          <section class="feed-user-pic">
//           <img src="${profilePic}" alt="${userName}'s Profile Picture" width="40">
//           <span>${userName.charAt(0)}</span>
//         </section>
//         <section class="feed-message-content">
//           <section class="feed-user-info">
//             <h4>${userName} <span class="time-stamp">${timeStamp}</span></h4>
//           </section>
//           <div>
//             <p class="feed-text">${message.content}</p>
//           </div>
//         </section>
//     `;
//         messageBox.appendChild(messageBlock);
//       });
//     })
//     .catch(error => {
//       console.error('Error fetching messages: ', error);
//     });
// }

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
