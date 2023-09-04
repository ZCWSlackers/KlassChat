import { API_URL } from './constants';

function fetchWorkspacesData() {
  fetch(`${API_URL}/api/workspaces`)
    .then(res => {
      //console.log("res is ", Object.prototype.toString.call(res));
      return res.json();
    })
    .then(data => {
      showWorkspaces(data);
    })
    .catch(error => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById('posts').innerHTML = 'Error Loading Tickets Data';
    });
}

function fetchChannels(workspaceid) {
  fetch(`${API_URL}/api/workspaces/${workspaceid}`)
    .then(res => {
      //console.log("res is ", Object.prototype.toString.call(res));
      return res.json();
    })
    .then(data => {
      showChannels(data);
    })
    .catch(error => {
      console.log(`Error Fetching data : ${error}`);
      document.getElementById('posts').innerHTML = 'Error Loading Single Ticket Data';
    });
}

function parseWorkspaceId() {
  try {
    var url_string = window.location.href.toLowerCase();
    var url = new URL(url_string);
    var workspaceid = url.searchParams.get('workspaceid');
    // var geo = url.searchParams.get("geo");
    // var size = url.searchParams.get("size");
    // console.log(workspaceid);
    return workspaceid;
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
    return '0';
  }
}
// takes a UNIX integer date, and produces a prettier human string
//function dateOf(date) {
//    const milliseconds = date * 1000 // 1575909015000
//    const dateObject = new Date(milliseconds)
//    const humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15
//    return humanDateFormat
//}

function showWorkspaces(data) {
  // the data parameter will be a JS array of JS objects
  // this uses a combination of "HTML building" DOM methods (the document createElements) and
  // simple string interpolation (see the 'a' tag on title)
  // both are valid ways of building the html.
  const ul = document.getElementById('posts');
  const list = document.createDocumentFragment();

  data.map(function (post) {
    console.log('Work Spaces:', post);
    let li = document.createElement('li');
    let title = document.createElement('h3');
    let body = document.createElement('p');
    let name = document.createElement('p');
    let channels = document.createElement('p');
    let by = document.createElement('p');

    title.innerHTML = `<a href="/workspaces.html?workspaceid=${post.id}">${post.name}</a>`;
    name.innerHTML = `${post.name}`;
    body.innerHTML = `${post.description}`;

    //Tried to do something that wasn't even needed.....
    //Maybe for the future. Currently displaying an empty list with commas in between
    //    const channelNames = post.channels.map(channel => channel.name).join(', ');
    //    channels.innerHTML = `Channels: ${channelNames}`;

    //let postedTime = dateOf(post.time)
    //by.innerHTML = `${post.date} - ${post.reportedBy}`;

    li.appendChild(title);
    li.appendChild(name);
    li.appendChild(body);
    //    li.appendChild(channels);

    list.appendChild(li);
  });

  ul.appendChild(list);
}

function showChannels(post) {
  // the data parameter will be a JS array of JS objects
  // this uses a combination of "HTML building" DOM methods (the document createElements) and
  // simple string interpolation (see the 'a' tag on title)
  // both are valid ways of building the html.
  const ul = document.getElementById('post');
  const detail = document.createDocumentFragment();

  console.log('Workspace:', post);
  let li = document.createElement('div');
  let title = document.createElement('h2');
  let body = document.createElement('p');
  let by = document.createElement('p');

  title.innerHTML = `${post.name}`;
  body.innerHTML = `${post.description}`;
  by.innerHTML = `${post.users}`;

  li.appendChild(title);
  li.appendChild(body);
  li.appendChild(by);
  detail.appendChild(li);

  ul.appendChild(detail);
}

function handlePages() {
  let workspaceid = parseWorkspaceId();
  console.log('workspaceid: ', workspaceid);

  if (workspaceid != null) {
    console.log('found a workspaceid');
    fetchChannels(workspaceid);
  } else {
    console.log('load all channels');
    fetchWorkspacesData();
  }
}

handlePages();
