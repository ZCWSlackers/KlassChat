import { API_URL } from './constants.js';
import { clearSelectedChannel, fetchChannelData } from './channels.js';
import { userID } from './displayuserinfo.js';
import { clearSelectedUsers } from './autocomplete.js';

const selectedUsers = [{ id: userID }];

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
    const workspaceDiv = document.createElement('div');
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    const workspaceButton = document.createElement('button');
    workspaceButton.type = 'button';
    workspaceButton.textContent = workspace.name;
    workspaceButton.className = 'workspace-channel-button';
    workspaceButton.style.flex = '90%';
    workspaceButton.addEventListener('click', () => handleWorkspaceButtonClick(workspace.id));

    const editSymbol = document.createElement('span');
    editSymbol.className = 'material-symbols-outlined';
    editSymbol.textContent = 'edit';
    editSymbol.style.display = 'flex';
    editSymbol.style.alignItems = 'center';
    editSymbol.style.justifyContent = 'center';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.appendChild(editSymbol);
    editButton.style.flex = '10%';
    editButton.addEventListener('click', () => handleEditButtonClick(workspace.id, workspace.name, workspace.description));

    buttonContainer.appendChild(workspaceButton);
    buttonContainer.appendChild(editButton);
    workspaceDiv.appendChild(buttonContainer);

    listItem.appendChild(workspaceDiv);
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
  clearSelectedChannel();
  fetchChannelData(workspaceId);
}

function handleEditButtonClick(id, name, desc) {
  const editForm = document.getElementById('editWSForm');
  editForm.style.display = 'block';
  document.getElementById('editWorkspaceId').value = id;
  document.getElementById('editWorkspaceName').value = name;
  document.getElementById('editWorkspaceDesc').value = desc;
  console.log(id, name, desc);
}

function addNewWorkspace() {
  event.preventDefault();
  document.getElementById('createWSForm').style.display = 'block';
}

function handleCreateSubmit(event) {
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
        closeForm('createWSForm')
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

function handleUpdateForm() {
  const workspaceID = document.getElementById('editWorkspaceId').value;
  const updatedWSName = document.getElementById('editWorkspaceName').value;
  const updatedWSDesc = document.getElementById('editWorkspaceDesc').value;

  const updatedWorkspaceData = {
    name: updatedWSName,
    description: updatedWSDesc,
  };

  fetch(`${API_URL}/api/workspaces/${workspaceID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedWorkspaceData),
  })
    .then(response => {
      if (response.ok) {
        // Workspace update was successful
        console.log('Workspace updated successfully.');
        // Optionally, you can close the form here or perform any other actions.
        closeForm('editWSForm'); // Implement this function to close the edit form.
      } else {
        // Handle errors if the request fails
        console.error('Error updating workspace:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Network error:', error);
    });
}

const form = document.querySelector('#createForm');
form.addEventListener('submit', handleCreateSubmit);
const addButton = document.querySelector('.add-new-workspace');
addButton.addEventListener('click', addNewWorkspace);
const closeButton = document.getElementById('closeWSCreateButton');
closeButton.addEventListener('click', () => closeForm('createWSForm'));
// const closeEditButton = document.getElementById('editCloseButton');
// closeEditButton.addEventListener('click', () => closeForm('editWSForm'));
// const updateSubmitButton = document.querySelector('#updateSubmit');
// updateSubmitButton.addEventListener('click', handleUpdateForm);

window.addEventListener('load', () => {
  console.log('Workspace Event Listener Loaded)');
  fetchWorkspaceData().then(() => {
    console.log('fetchWorkspaceData has completed.');
  });
});

// const updateForm = document.getElementById('updateForm');
// updateForm.addEventListener('submit', function(event) {
//   event.preventDefault();
//   handleUpdateForm();
// });

function closeForm(id) {
  document.getElementById(id).style.display = 'none';
  clearSelectedUsers();
  return Promise.resolve();
}

function clearWorkspaceList() {
  const workspaceList = document.getElementById('workspaceList');
  workspaceList.innerHTML = '';
}

export { workspaceId, fetchWorkspaceData, clearWorkspaceList };
