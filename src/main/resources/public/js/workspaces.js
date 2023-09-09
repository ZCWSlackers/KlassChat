import { API_URL } from './constants.js';
import { fetchChannelData } from './channels.js';

// Each workspace has a list of users.
// If your id is not present in that list, you should not be able to see that workspace.

function userId() {
  try {
    var url_string = window.location.href.toLowerCase();
    var url = new URL(url_string);
    var userid = url.searchParams.get('userid');
    // var geo = url.searchParams.get("geo");
    // var size = url.searchParams.get("size");
    console.log(userid);
    return userid;
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return '0';
  }
}

async function fetchUser(id) {
  try {
    let userResponse = await fetch(`${API_URL}/api/users/${id}`, {
      // Get the response of the fetch
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    let userJson = await userResponse.json(); // Getting the JSON Body out of the Response
    //    console.log(userJson);
    return userJson;
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
    const currentUser = userId();
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

  data.forEach((workspace, index) => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = workspace.name;
    button.addEventListener('click', () => handleWorkspaceButtonClick(workspace.id));

    listItem.appendChild(button);
    workspaceButtons.appendChild(listItem);

    if (index === data.length - 1) {
      const addWorkspaceButton = document.createElement('button');
      addWorkspaceButton.type = 'button';
      addWorkspaceButton.textContent = 'Add Workspace';
      addWorkspaceButton.addEventListener('click', () => handleAddWorkspaceClick());

      const addWorkspaceItem = document.createElement('li');
      addWorkspaceItem.appendChild(addWorkspaceButton);
      workspaceButtons.appendChild(addWorkspaceItem);
    }
  });
}
function handleAddWorkspaceClick() {
  // Open the form when the "Add Workspace" button is clicked
  openForm();
}

function openForm() {
  // Display the form
  document.getElementById('myForm').style.display = 'block';

  // You can add additional logic here to initialize the form or perform any other actions
}

function closeForm() {
  // Close the form
  document.getElementById('myForm').style.display = 'none';
}

function handleWorkspaceButtonClick(selectedWorkspaceId) {
  workspaceId = selectedWorkspaceId;
  console.log(workspaceId);

  const workspaceNameElement = document.getElementById('workspace-link');
  const selectedWorkspace = workspaceData.find(workspace => workspace.id === selectedWorkspaceId);
  if (selectedWorkspace) {
    workspaceNameElement.textContent = 'Workspace: ' + selectedWorkspace.name;
  }

  fetchChannelData(workspaceId);
}

window.addEventListener('load', () => {
  console.log('Workspace Event Listener Loaded)');
  fetchWorkspaceData().then(() => {
    console.log('fetchWorkspaceData has completed.');
  });
});

export { workspaceId };
