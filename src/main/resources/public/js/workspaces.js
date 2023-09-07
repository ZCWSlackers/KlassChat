import { API_URL } from './constants.js';
import { collapsibleButtons } from './collapsible.js';
import { fetchMessages } from './fetchmessages.js';

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
window.addEventListener('load', () => {
  console.log('Workspace Event Listener Loaded)');
  fetchWorkspaceData();
});
collapsibleButtons();

function createWorkspaceButtons(data) {
  const workspaceButtons = document.getElementById('workspaceList');

  data.forEach(workspace => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = workspace.name;
    button.addEventListener('click', () => handleWorkspaceButtonClick(workspace.id));

    const li = document.createElement('li');
    li.appendChild(button);
    workspaceButtons.appendChild(li);
  });
}

function handleWorkspaceButtonClick(selectedWorkspaceId) {
  workspaceId = selectedWorkspaceId;
  console.log(workspaceId);

  const workspaceNameElement = document.getElementById('workspace-c-button');
  const selectedWorkspace = workspaceData.find(workspace => workspace.id === selectedWorkspaceId);
  if (selectedWorkspace) {
    workspaceNameElement.textContent = selectedWorkspace.name;
  }
  // fetchMessages(selectedWorkspaceId);
}

export { workspaceId };
