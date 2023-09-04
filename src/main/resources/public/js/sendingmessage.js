const API_URL = `http://localhost:8080`;

//message json
//{
//  "id" : 1,
//  "content" : "I need the slide decks from Dolio's lecture today\n",
//  "timestamp" : "2023-08-30T10:46:00Z",
//  "user" : {
//    "id" : 1,
//    "login" : null
//  },
//  "channel" : {
//    "id" : 1,
//    "name" : null,
//    "description" : null,
//    "workspace" : null,
//    "users" : [ ]
//  }
//}

const sendingUser = document.getElementById('user');
const currentChannel = document.getElementById('channel');

document.addEventListener('DOMContentLoaded', function () {
  const messageTextarea = document.getElementById('message');
  const sendButton = document.getElementById('sendButton');
  const responseMessage = document.getElementById('responseMessage');

  sendButton.addEventListener('click', function () {
    // Get the message from the textarea
    const message = messageTextarea.value;

    // Check if the message is not empty
    if (message.trim() === '') {
      responseMessage.innerText = 'Please enter a message.';
      return;
    }

    // Create an object to send as JSON data
    // Need to grab user id of sender AND the channel user is in
    //let response = HTTP.Response;

    const data = {
      timestamp: new Date().toISOString(),
      content: message,
      user: sendingUser, //variableName.id for User id
      channel: currentChannel, //channelVariable.id for Channel id
    };

    // Send an HTTP POST request
    fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server
        responseMessage.innerText = 'SENT';
        //            console.log(response.status);
      })
      .catch(error => {
        console.error('Error:', error);
        responseMessage.innerText = 'An error occurred while sending the message.';
      });

    // Clear the textarea
    messageTextarea.value = '';
  });
});
