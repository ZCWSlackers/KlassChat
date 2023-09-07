import { API_URL } from './constants.js';

let workspaceId;
let workspaceData = [];

function fetchWorkspaceData() {
  fetch(`${API_URL}/api/workspaces`)
    .then(response => response.json())
    .then(data => {
      workspaceData = data;
      createWorkspaceButtons(data);
    })
    .catch(error => {
      console.error('Error fetching channel data: ', error);
    });
}
window.addEventListener('load', fetchWorkspaceData);

function createWorkspaceButtons(data, workspaceDropdown) {
  // const workspaceDropdown = document.getElementById('workspaceDropdown');
  workspaceDropdown.innerHTML = '';

  data.forEach(workspace => {
    const option = document.createElement('option');
    option.value = workspace.id;
    option.textContent = workspace.name;
    workspaceDropdown.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DomContentLoaded event');
  fetchWorkspaceData();
});
