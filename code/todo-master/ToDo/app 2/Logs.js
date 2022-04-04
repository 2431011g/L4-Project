'use strict';

const page = [
  {
    id: 0,
    name: 'Register'
  },
  {
    id: 1,
    name: 'Login'
  },
  {
    id: 2,
    name: 'Home'
  },
  {
    id: 3,
    name: 'Task'
  },
  {
    id: 4,
    name: 'Location'
  },
  {
    id: 5,
    name: 'Map'
  },
]

const Logs = (data, callback) => {
  fetch(data.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'session_id': data.session_id
    },
    body: JSON.stringify({
      page_id: page[data.page_id]['id']
    })
  })
  .then(response => response.json())
  .then((response) => {
    callback(response)
  })
  .catch((error) => {
    console.log(error);
  })
}

export { Logs as default };
