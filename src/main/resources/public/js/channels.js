import { API_URL } from './constants.js';
import { fetchMessages } from './fetchmessages.js';

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

window.addEventListener('load', fetchChannelData);

let coll = document.getElementsByClassName('collapsible');

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    let content = this.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
}

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
