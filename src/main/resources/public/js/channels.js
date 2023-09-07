import { API_URL } from './constants.js';
import { fetchMessages } from './fetchmessages.js';
import { collapsibleButtons } from './collapsible.js';

let channelId;
let channelData = [];

function fetchChannelData() {
  fetch(`${API_URL}/api/channels`)
    .then(response => response.json())
    .then(data => {
      channelData = data;
      createChannelButtons(data);
    })
    .catch(error => {
      console.error('Error fetching channel data: ', error);
    });
}

window.addEventListener('load', () => {
  console.log('Channel Even Listener Loaded)');
  fetchChannelData();
});

// collapsibleButtons();  Only need this once in the code.  Leaving it so I don't forget

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
  const channelButtonElement = document.getElementById('channel-c-button');

  if (selectedChannel) {
    channelNameElement.textContent = selectedChannel.name;
    channelButtonElement.textContent = selectedChannel.name;
  }
  fetchMessages(selectedChannelId);
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
