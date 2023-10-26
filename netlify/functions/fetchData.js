const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiUrl = 'http://localhost:8000/api' + event.path;
  const response = await fetch(apiUrl);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
