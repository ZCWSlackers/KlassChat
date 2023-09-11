import { API_URL } from './constants.js';
import { fetchChannelData } from './channels.js';
import { userID } from './displayuserinfo.js';

// Each workspace has a list of users.
// If your id is not present in that list, you should not be able to see that workspace.

// function userId() {
//   try {
//     var url_string = window.location.href.toLowerCase();
//     var url = new URL(url_string);
//     var userid = url.searchParams.get('userid');
//     // var geo = url.searchParams.get("geo");
//     // var size = url.searchParams.get("size");
//     console.log(userid);
//     return userid;
//   } catch (err) {
//     console.log("Issues with Parsing URL Parameter's - " + err);
//     return '0';
//   }
// }

async function fetchUser(id) {
  try {
    let userResponse = await fetch(`${API_URL}/api/users/${id}`, {
      // Get the response of the fetch
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    // Getting the JSON Body out of the Response
    //    console.log(userJson);
    return await userResponse.json();
  } catch (error) {
    console.log('Error Fetching User JSON');
  }
}

let workspaceId = 1;
let workspaceData = [];

// function fetchWorkspaceData() {
//   fetch(`${API_URL}/api/workspaces`)
//     .then(response => response.json())
//     .then(data => {
//       workspaceData = data;
//       createWorkspaceList(data);
//       handleWorkspaceButtonClick(workspaceId);
//     })
//     .catch(error => {
//       console.error('Error fetching workspace data: ', error);
//     });

async function fetchWorkspaceData() {
  try {
    const currentUser = userID;
    const userJson = await fetchUser(currentUser);

    const dataResponse = await fetch(`${API_URL}/api/workspaces`);
    const data = await dataResponse.json();

    // Check each workspaces' user and see if ANY of the user has and id that matches userJson.id
    // And if ANY of the user matches, add it to workspaceData.
    // https://blog.debugeverything.com/javascript-filter-method-4-tips-on-how-to-use-efficiently/
    workspaceData = data.filter(workspace => workspace.users.some(user => user.id === userJson.id));

    console.log('All workspaces: ' + JSON.stringify(data));
    console.log('Filtered workspaces: ' + JSON.stringify(workspaceData));
    console.log('current user id: ' + currentUser);

    createWorkspaceButtons(workspaceData);
    handleWorkspaceButtonClick(workspaceId);
  } catch (error) {
    console.error('Failed to load workspaces', error);
  }
}

function createWorkspaceButtons(data) {
  const workspaceButtons = document.getElementById('workspaceList');

  data.forEach(workspace => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = workspace.name;
    button.className = 'workspace-channel-button';
    button.addEventListener('click', () => handleWorkspaceButtonClick(workspace.id));

    listItem.appendChild(button);
    workspaceButtons.appendChild(listItem);
  });
}

function handleWorkspaceButtonClick(selectedWorkspaceId) {
  workspaceId = selectedWorkspaceId;
  console.log(workspaceId);

  const workspaceNameElement = document.getElementById('workspace-link');
  const selectedWorkspace = workspaceData.find(workspace => workspace.id === selectedWorkspaceId);
  if (selectedWorkspace) {
    workspaceNameElement.textContent = 'Workspace: ' + selectedWorkspace.name;
  }
  let messageBox = document.querySelector('.messageBox');
  // Clear any existing messages in the messageBox
  messageBox.innerHTML = '';
  console.log(messageBox);
  console.log('is this getting called');
  fetchChannelData(workspaceId);
}

window.addEventListener('load', () => {
  console.log('Workspace Event Listener Loaded)');
  fetchWorkspaceData().then(() => {
    console.log('fetchWorkspaceData has completed.');
  });
});

function addNewWorkspace() {
  event.preventDefault();
  document.getElementById('myForm').style.display = 'block';
}
function handleSubmit(event) {
  event.preventDefault();
  const workspaceName = document.querySelector('input[name="workspaceName"]').value;
  const workspaceDesc = document.querySelector('input[name="workspaceDesc"]').value;
  // const search = document.querySelector('input[name="search"]').value;
  const workspaceData = {
    name: workspaceName,
    description: workspaceDesc,
    users: [{ id: userID }],
  };
  fetch(`${API_URL}/api/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workspaceData),
  })
    .then(response => {
      if (response.ok) {
        // Workspace creation was successful
        console.log('Workspace created successfully.');
        // Optionally, you can close the form here
        closeForm()
          .then(() => clearWorkspaceList())
          .then(() => fetchWorkspaceData());
      } else {
        // Handle errors if the request fails
        console.error('Error creating workspace:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Network error:', error);
    });
}

const form = document.querySelector('.form-container');
form.addEventListener('submit', handleSubmit);
const addButton = document.querySelector('.add-new-workspace');
addButton.addEventListener('click', addNewWorkspace);
const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', closeForm);

function closeForm() {
  document.getElementById('myForm').style.display = 'none';
  return Promise.resolve();
}

function clearWorkspaceList() {
  const workspaceList = document.getElementById('workspaceList');
  workspaceList.innerHTML = '';
}

export { workspaceId, fetchWorkspaceData, clearWorkspaceList };
