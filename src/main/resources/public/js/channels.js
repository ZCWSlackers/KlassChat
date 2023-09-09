import { API_URL } from './constants.js';
import { fetchMessages } from './fetchmessages.js';
import { workspaceId } from './workspaces.js';
import { collapsibleButtons } from './collapsible.js';

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
  const selectedChannel = channelData.find(channel => channel.id === selectedChannelId);

  if (selectedChannel) {
    channelNameElement.textContent = selectedChannel.name;
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
