import { API_URL } from './constants.js';
import { channelId } from './channels.js';

//import { userFirstName } from './sendingmessage.js';

//function fetchMessages(channelId) {
//  fetch(`${API_URL}/api/messages/channel/${channelId}`)
//    .then(response => response.json())
//    .then(messages => {
//      displayMessages(messages);
//    })
//    .catch(error => {
//      console.error('Error fetching messages: ', error);
//    });
//}

function userId() {
  try {
    let url_string = window.location.href.toLowerCase();
    let url = new URL(url_string);
    let userid = url.searchParams.get('userid');
    // var geo = url.searchParams.get("geo");
    // var size = url.searchParams.get("size");
    console.log(userid);
    return userid;
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return '0';
  }
}

async function deleteMessage(messageId) {
  // get the message id, and call a delete
  try {
    const deleteRequest = await fetch(`${API_URL}/api/messages/${messageId}`, {
      method: 'DELETE', // Calling the delete method
      header: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 204) {
      console.log('Message has been deleted');
    } else {
      console.error('Something went wrong', error);
    }
  } catch (error) {
    console.error('Error deleting that message', error);
  }
  fetchMessages(channelId); // Refresh the page after a deletion.
}

async function fetchMessages(channelId) {
  try {
    const response = await fetch(`${API_URL}/api/messages/channel/${channelId}`);
    const messages = await response.json();

    const messageBox = document.querySelector('.messageBox');
    // Clear any existing messages in the messageBox
    messageBox.innerHTML = '';

    // Iterate through the messages and create an article for each one
    for (const message of messages) {
      // Add default values for userName and userPic if they are missing or undefined
      const userID = message.user.id;
      const userName = message.user.firstName || 'Unknown User';
      const userPic = message.profilePic || `assets/imageuser${userID}.png` || 'assets/smile.png';
      const article = document.createElement('article');
      const timestamp = new Date(message.timestamp);
      const formattedTimestamp = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.classList.add('feed-text');
      deleteButton.addEventListener('click', () => {
        deleteMessage(message.id); // will eventually be an actual function
      });

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
      // If message.user.id matches user.id, append
      if (userID == userId() || userId() == 1) {
        article.appendChild(deleteButton);
      }
      // Append the article to the messageBox
      messageBox.appendChild(article);
    }
  } catch (error) {
    console.error('Error fetching messages: ', error);
  }
}

export { fetchMessages };
