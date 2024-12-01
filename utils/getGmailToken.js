const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Load credentials from credentials.json file
const credentials = require('./credentials.json'); // Adjust the path

// Create an OAuth2Client instance with credentials
const oAuth2Client = new OAuth2Client(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

// Generate an authentication URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/'],
});

console.log('Authorize this app by visiting this url:', authUrl);

async function obtainRefreshToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();
    oAuth2Client.getToken(code, async (err, token) => {
      if (err) {
        console.error('Error getting refresh token:', err);
        return;
      }
      console.log('Refresh Token:', token.refresh_token);

      // Write the refresh token to a file
      const TOKEN_PATH = './token.json'; // Adjust the path
      fs.writeFileSync(
        path.resolve(__dirname, TOKEN_PATH),
        JSON.stringify(token)
      );

      // Now you can use the refresh token to authenticate
      oAuth2Client.setCredentials(token);
      // ... Your further code using oAuth2Client ...

    });
  });
}

// Call the function to start obtaining the refresh token
obtainRefreshToken();
