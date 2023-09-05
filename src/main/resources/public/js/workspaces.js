import { API_URL } from './constants.js';

function fetchWorkspaceData() {
  fetch(`${API_URL}/api/workspaces`)
    .then(response => response.json())
    .then(data => {
      createChannelDropdown(data);
    })
    .catch(error => {
      console.error('Error fetching channel data: ', error);
    });
}

function createChannelDropdown(workspaceData) {
  const selectedChannel = document.createElement('selected-channel');
}
