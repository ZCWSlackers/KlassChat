import { API_URL } from './constants.js';
import { channelId } from './channels.js';
import { fetchMessages } from './fetchmessages.js';

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
//const sendingUser = userId();
function fetchUser(useridnum) {
  fetch(`${API_URL}/api/users/${useridnum}`).then(res => {
    //console.log("res is ", Object.prototype.toString.call(res));
    return res.json();
  });
}
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

      user: {
        id: parseInt(userId()),
        login: null, //variableName.id for User id
      },
      //user: sendingUser, //variableName.id for User id    Will need to be update like below
      channel: {
        //this has to be nested to apply the channel id correctly
        id: channelId,
      }, //channelVariable.id for Channel id
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
        console.log('Printing');
        fetchMessages(channelId); //temporary
      })
      .catch(error => {
        console.error('Error:', error);
        responseMessage.innerText = 'An error occurred while sending the message.';
      });

    // Clear the textarea
    messageTextarea.value = '';
  });
});
