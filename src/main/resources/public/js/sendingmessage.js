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

let sendingUser = userId();

//function fetchUser(id) {
////   fetch(`${API_URL}/api/users/${id}`)
////    .then(response => {
////      if (!response.ok) {
////        throw new Error('Network response was not ok');
////      }
////      console.log(JSON.stringify(response.json()));
////      return response.json(); // Convert the response to JSON and return it
////    });
//
///////////
//
//fetch(`${API_URL}/api/users/${id}`, {
//    method: `GET`,
//    headers: {
//        'Accept': 'application/json',
//    },
//})
//   .then(response => response.json())
//   .then(response => console.log(JSON.stringify(response)))
//}

let userFirstName = null;
let userLastName = null;
let userLogin = null;
let trackingVar = null;

function fetchUser(id) {
  trackingVar = 'Hello';
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

//console.log(userJson);
document.addEventListener('DOMContentLoaded', function () {
  const messageTextarea = document.getElementById('message');
  const sendButton = document.getElementById('sendButton');
  const responseMessage = document.getElementById('responseMessage');
  const userJson = fetchUser(sendingUser);

  sendButton.addEventListener('click', function () {
    // Get the message from the textarea
    const message = messageTextarea.value;
    //    let userFName = fetchFirstName();
    //    console.log(fetchFirstName());

    // Check if the message is not empty
    if (message.trim() === '') {
      responseMessage.innerText = 'Please enter a message.';
      return;
    }

    // Create an object to send as JSON data
    // Need to grab user id of sender AND the channel user is in
    // let response = HTTP.Response;

    const data = {
      timestamp: new Date().toISOString(),
      content: message,
      user: {
        id: parseInt(userId()),
        login: userLogin,
        firstName: userFirstName,
        lastName: userLastName, //variableName.id for User id
      },
      //user: sendingUser, //variableName.id for User id    Will need to be update like below
      channel: {
        //this has to be nested to apply the channel id correctly
        id: channelId,
      }, //channelVariable.id for Channel id
    };
    console.log(data);
    console.log(trackingVar);

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

    // Clear the text area
    messageTextarea.value = '';
  });
});

export { userFirstName };
