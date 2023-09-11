import { API_URL } from './constants.js';

function userId() {
  try {
    let url_string = window.location.href.toLowerCase();
    let url = new URL(url_string);
    let userid = url.searchParams.get('userid');
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
    // Getting the JSON Body out of the Response
    //    console.log(userJson);
    return await userResponse.json();
  } catch (error) {
    console.log('Error Fetching User JSON');
  }
}

async function displayUserInfo() {
  try {
    const userJson = await fetchUser(userId());
    console.log(JSON.stringify(userJson));
    const userInfo = document.getElementById('userInfo');
    const picture = document.getElementById('userPic');

    //    const userPic = document.getElementById('userPic');
    picture.src = `./assets/imageuser${userID}.png`;

    const userName = userJson.firstName + ' ' + userJson.lastName;
    userInfo.innerHTML = userName;
    console.log(userName);
  } catch (error) {
    console.error('Failed to fetch user info');
  }
}

const allUsernames = [];
async function fetchAllUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const users = await response.json();

    // Extract the login values from the fetched users and add them to the usernames array
    const loginValues = users.map(user => user.login);
    allUsernames.push(...loginValues);

    return allUsernames; // Return the array of usernames
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

displayUserInfo();

const userID = userId();
console.log(userID);
export { userID, allUsernames, fetchAllUsers };
