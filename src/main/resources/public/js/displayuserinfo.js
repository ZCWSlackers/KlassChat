import { API_URL } from './constants.js';

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

async function displayUserInfo() {
  try {
    const userJson = await fetchUser(userId());
    console.log(JSON.stringify(userJson));
    const userInfo = document.getElementById('userInfo');
    const picture = document.getElementById('userPic');

    //    const userPic = document.getElementById('userPic');
    const profilePic = `./assets/imageuser${userID}.png`;
    picture.src = profilePic;

    const userName = userJson.firstName + ' ' + userJson.lastName;
    userInfo.innerHTML = userName;
    console.log(userName);
  } catch (error) {
    console.error('Failed to fetch user info');
  }
}

displayUserInfo();

const userID = userId();
console.log(userID);
export { userID };
