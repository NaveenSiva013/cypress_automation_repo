const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
require('dotenv').config()

const SCOPES = ['https://mail.google.com/',]
let searchQuery = {
    userId: 'me',
    q: 'in:inbox',
    maxResults: 500,
}

async function authorize(gmailUser) {
    try {
        let GMAIL_CLIENT_ID = "";
        let GMAIL_CLIENT_SECRET = "";
        let GMAIL_REFRESH_TOKEN = "";

        if (gmailUser.includes("reset")) {
            // Reassign the values for specific cases
            GMAIL_CLIENT_ID = process.env.RESET_EMAIL_CLIENT_ID;
            GMAIL_CLIENT_SECRET = process.env.RESET_EMAIL_CLIENT_SECRET;
            GMAIL_REFRESH_TOKEN = process.env.RESET_EMAIL_REFRESH_TOKEN;
        }
        else{
            GMAIL_CLIENT_ID = process.env.FORGOT_EMAIL_CLIENT_ID;
            GMAIL_CLIENT_SECRET = process.env.FORGOT_EMAIL_CLIENT_SECRET;
            GMAIL_REFRESH_TOKEN = process.env.FORGOT_EMAIL_REFRESH_TOKEN;
          }
       
        // Create a new OAuth2Client instance
        const oAuth2Client = new OAuth2Client(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);
        oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
        return oAuth2Client;
    } catch (error) {
        return console.log("[gmail] Error:", err);
    }
}

async function get_new_token(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        rl.question("Enter the code from that page here: ", async code => {
            rl.close();
            oAuth2Client.getToken(code, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    oAuth2Client.setCredentials(token);
                    fs.writeFileSync(
                        JSON.stringify(process.env.token)
                    );
                    resolve(oAuth2Client);
                }
            });
        });
    });
}

const bulkDeleteMessages = async (gmail, oauth2Client, requestBody) => {
    console.log('bulkDeleteMessages')
    console.log(requestBody)
    return new Promise((resolve, reject) => {
        gmail.users.messages.batchDelete(
            {
                userId: 'me',
                resource: requestBody,
                auth: oauth2Client
            },
            (err, res) => {
                if (err) {
                    console.log('The API returned an error: ' + err)
                    reject('The API returned an error: ' + err)
                }
                if (res.status === 204) {
                    console.log(`Permanently deleted ${requestBody.ids.length} emails.`)
                    resolve(`Permanently deleted ${requestBody.ids.length} emails.`)
                }
            },
        )
    })
}

const findMessages = async (gmail, query) => {
    let batchRequestBody = {
        ids: [],
    }

    return new Promise((resolve) => {
        gmail.users.messages.list(query, async (err, res) => {
            if (err) return console.log('The API returned an error: ' + err)
            const messages = res.data.messages
            if (messages && messages.length) {
                messages.forEach((msg) => {
                    batchRequestBody.ids.push(msg.id)
                })
                resolve(batchRequestBody);
            } else {
                console.log('No (more) matching emails found.')
                resolve(batchRequestBody);
            }
        })
    })
}

const getMessage = async (gmailAuth, messageId) => {
    return new Promise((resolve, reject) => {
        gmailAuth.gmailClient.users.messages.get(
            {
                auth: gmailAuth.oAuth2Client,
                userId: "me",
                id: messageId,
                format: "full"
            },
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.data);
                }
            }
        );
    })
}


const decodeMessage = async (message) => {
  let body = "";

  if (message.payload.parts && message.payload.parts.length > 0) {
    // If the message has multiple parts (e.g., text and attachments)
    // Loop through each part to find the plain text part
    for (const part of message.payload.parts) {
      if (part.mimeType === "text/plain") {
        // Decode the base64-encoded text part
        body = Buffer.from(part.body.data, "base64").toString("utf-8");
        break; // Found the plain text part, exit the loop
      }
    }
  } else if (message.payload.body.data) {
    // If the message has a single body, it is likely plain text
    body = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
  }
//   console.log('Displaying body contents:')
//   console.log(body)
  return body;
}


async function deleteEmailsByQuery(oauth2Client, gmailClient) {
    searchQuery['auth'] = oauth2Client;
    const batchRequestBody = await findMessages(gmailClient, searchQuery)
    if (batchRequestBody.ids && batchRequestBody.ids.length) {
        return bulkDeleteMessages(gmailClient, oauth2Client, batchRequestBody)
    } else {
        return 'No emails found !!!'
    }
}

async function getGmailAuthorization(gmailUser) {
    const oAuth2Client = await authorize(gmailUser);
    const gmailClient = google.gmail({ version: "v1", oAuth2Client });
    return { oAuth2Client, gmailClient }
}

async function deleteAllMessages(args) {
    try {
        console.log(args.options.gmailUser)
        const { oAuth2Client, gmailClient } = await getGmailAuthorization(args.options.gmailUser)
        return deleteEmailsByQuery(oAuth2Client, gmailClient)
    } catch (err) {
        return console.log("[gmail] Error:", err);
    }
}

async function getMatchingMessages(args) {
    const gmailAuth = await getGmailAuthorization(args.options.gmailUser)
    const messageIds = await waitForReceivingTheMail(gmailAuth, args)
    if (messageIds.ids && messageIds.ids.length) {
        const encodedMessage = await getMessage(gmailAuth, messageIds.ids[0])
        // console.log('Displaying encodedMessage:')
        console.log(encodedMessage)
        return decodeMessage(encodedMessage)
    } else {
        return 'No emails found !!!'
    }
}

function initQuery(options) {
    const { to, from, subject } = options;
    let query = 'in:inbox ';
    if (to) {
        query += `to:"${to}" `;
    }
    if (from) {
        query += `from:"${from}" `;
    }
    if (subject) {
        query += `subject:(${subject}) `;
    }
    query = query.trim();
    return query;
}

async function waitForReceivingTheMail(gmailAuth, args) {
    searchQuery['auth'] = gmailAuth.oAuth2Client;
    searchQuery['q'] = initQuery(args.options.searchQuery);
    let batchRequestBody = {
        ids: [],
    }

    return new Promise((resolve) => {
        let checkEmails = setInterval(async () => {
            batchRequestBody = await findMessages(gmailAuth.gmailClient, searchQuery)
            if (batchRequestBody.ids && batchRequestBody.ids.length) {
                clearInterval(checkEmails);
                console.log('Messages found')
                resolve(batchRequestBody)
            }
        }, 5000);

        setTimeout(() => {
            clearInterval(checkEmails);
            resolve(batchRequestBody);
        }, args.options.timeoutInMilliseconds);
    })
}

// const user = 'reset password'; // Example user

// deleteAllMessages({
//     options: {
//         userName: user
//     }
// });

module.exports = {
    deleteAllMessages,
    getMatchingMessages,
    
}