const API_URL = `http://localhost:8080`;

function loadChannelNames() {
  fetch(`${API_URL}/api/channels`)
    .then(response => response.json())
    .then(data => {
      showChannelNames(data);
    })
    .catch(error => {
      console.error('Error fetching channel data: ', error);
    });
}

function showChannelNames(data) {
  const channelList = document.getElementById('channelList');
  data.forEach(channel => {
    let li = document.createElement('li');
    let channelName = document.createElement('p');
    channelName.textContent = channel.name;
    li.appendChild(channelName);
    channelList.appendChild(li);
  });
}

window.addEventListener('load', loadChannelNames);
