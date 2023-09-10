import { API_URL } from './constants.js';
import { fetchMessages } from './fetchmessages.js';
import { fetchWorkspaceData, workspaceId } from './workspaces.js';
import { collapsibleButtons } from './collapsible.js';
import { userID } from './displayuserinfo.js';

let channelId = 1;
let channelData = [];

export function fetchChannelData(workspaceId) {
  clearChannelList();
  fetch(`${API_URL}/api/channels/workspace/${workspaceId}`)
    .then(response => response.json())
    .then(data => {
      channelData = data;
      createChannelButtons(data);
      handleChannelButtonClick(channelId);
    })
    .catch(error => {
      console.error('Error fetching channel data: ', error);
    });
}

window.addEventListener('load', () => {
  console.log('Channel Even Listener Loaded)');
  fetchChannelData(workspaceId);
});

collapsibleButtons(); // Only need this once in the code.  Leaving it so I don't forget

function createChannelButtons(data) {
  const channelButtons = document.getElementById('channelList');

  data.forEach(channel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'workspace-channel-button';
    button.textContent = channel.name;
    button.addEventListener('click', () => handleChannelButtonClick(channel.id));

    const li = document.createElement('li');
    li.appendChild(button);
    channelButtons.appendChild(li);
  });
}

function handleChannelButtonClick(selectedChannelId) {
  channelId = selectedChannelId;
  console.log(channelId);

  const channelNameElement = document.querySelector('.channel-name');
  const channelListElement = document.getElementById('channel-link');
  const selectedChannel = channelData.find(channel => channel.id === selectedChannelId);

  if (selectedChannel) {
    channelNameElement.textContent = selectedChannel.name;
    channelListElement.textContent = 'Channel: ' + selectedChannel.name;
  }
  fetchMessages(selectedChannelId)
    .then(messages => {
      // Handle messages here
      console.log('Received messages:', messages);
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
}

function addNewChannel() {
  event.preventDefault();
  document.getElementById('myChannelForm').style.display = 'block';
}
function handleChannelSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const channelName = document.querySelector('input[name="channelName"]').value;
  const channelDesc = document.querySelector('input[name="channelDesc"]').value;
  // const search = document.querySelector('input[name="search"]').value;
  const channelData = {
    name: channelName,
    description: channelDesc,
    workspace: {
      id: workspaceId,
    },
    users: [{ id: userID }],
  };
  fetch(`${API_URL}/api/channels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(channelData),
  })
    .then(response => {
      if (response.ok) {
        // Channel creation was successful
        console.log('Channel created successfully.');
        // Optionally, you can close the form here
        closeChannelForm()
          .then(() => clearChannelList())
          .then(() => fetchWorkspaceData());
      } else {
        // Handle errors if the request fails
        console.error('Error creating channel:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Network error:', error);
    });
}

const channelForm = document.getElementById('channel-form');
channelForm.addEventListener('submit', handleChannelSubmit);
const addButton = document.querySelector('.add-new-channel');
addButton.addEventListener('click', addNewChannel);
const closeButton = document.getElementById('channelCloseButton');
closeButton.addEventListener('click', closeChannelForm);

function closeChannelForm() {
  document.getElementById('myChannelForm').style.display = 'none';
  return Promise.resolve();
}

function clearChannelList() {
  const channelList = document.getElementById('channelList');
  channelList.innerHTML = '';
}

export { channelId };

//I don't think we need anymore.  Moving to the bottom and leaving it for now
// function showChannelNames(data) {
//   const channelList = document.getElementById('channelList');
//   data.forEach(channel => {
//     let li = document.createElement('li');
//     let channelName = document.createElement('p');
//     channelName.textContent = channel.name;
//     li.appendChild(channelName);
//     channelList.appendChild(li);
//   });
// }
