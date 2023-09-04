import { API_URL } from './constants.js';

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

//I don't think we need anymore.  Leaving it for now
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

window.addEventListener('load', fetchChannelData);

let coll = document.getElementsByClassName('collapsible');

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var content = this.nextElementSibling;
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
    button.addEventListener('click', () => handleChannelButtonClick(channel.name));

    const li = document.createElement('li');
    li.appendChild(button);
    channelButtons.appendChild(li);
  });
}

function handleChannelButtonClick(channelName) {
  // Select the HTML element with the class "channel-name" and store it in the variable channelNameElement
  const channelNameElement = document.querySelector('.channel-name');
  // Set the text content of the selected "channel-name" element to the value of the channelName parameter
  channelNameElement.textContent = channelName;
}

export { channelData };