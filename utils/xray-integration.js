const axios = require('axios');
const path = require('path');

async function GetAuthToken() {
  try {
    const requestOptions = {
      method: 'post',
      url: 'https://xray.cloud.getxray.app/api/v2/authenticate',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      }
    };

    const response = await axios(requestOptions);
    const result = response.data;
    console.log(result);
    return result.replace(/"/g, ''); // Remove quotes from token
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function postResult() {
  try {
    const globalToken = await GetAuthToken();
    console.log("Authorization Token:", globalToken);
    const logJsonPath = path.join(__dirname, process.env.REPORT_JSON_PATH);
    const requestOptions = {
      method: 'post',
      url: 'https://xray.cloud.getxray.app/api/v1/import/execution/cucumber',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalToken}`
      },
      data: require(logJsonPath)
    };

    const response = await axios(requestOptions);
    const result = response.data;
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

postResult();
