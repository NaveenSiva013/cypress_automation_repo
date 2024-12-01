const axios = require('axios');
const fs = require('fs');
require('dotenv').config()
const path = require('path');


async function sendSlackNotification() {
  return new Promise((resolve, reject) => {
    const slackWebHookURL = process.env.SLACK_WEBHOOK;
    let jobUrl = 'Local execution';
   
    if (process.env.GITHUB_SERVER_URL) {
      
      jobUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    }
    
    const rootPath = path.resolve(__dirname, '..'); // Assuming the .env is in the parent directory
    process.chdir(rootPath);
    // Load the JSON report
    const reportData = JSON.parse(fs.readFileSync(process.env.REPORT_JSON_PATH, 'utf8'));

// Initialize counters
let totalScenarios = 0;
let passCount = 0;
let failCount = 0;
let skipCount = 0;

// Iterate through the JSON data
reportData.forEach((feature) => {
    if (feature.elements) {
        feature.elements.forEach((scenario) => {
            totalScenarios++;
            const status = scenario.steps.every(step => step.result.status === 'passed') ? 'passed' : 'failed';
            if (status === 'passed') {
                passCount++;
            } else if (status === 'failed') {
                failCount++;
            } else {
                skipCount++;
            }
        });
    }
});

// Print the results
console.log(`Total Scenarios: ${totalScenarios}`);
console.log(`Pass Count: ${passCount}`);
console.log(`Fail Count: ${failCount}`);
console.log(`Skip Count: ${skipCount}`);

    const message = {
      channel: process.env.SLACKCHANNEL,
      text: "Cypress Test Report",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Cypress Test Report*"
          }
        },
        {
          type: "section",
          text: {

            type: "mrkdwn",
            text: `:bar_chart: *Total test:${totalScenarios}*`
          },
        },
        {
          type: "section",
          text: {

            type: "mrkdwn",
            text: `\n:x: *Failed Tests:${failCount}*`
          },
        },
        {
          type: "section",
          text: {

            type: "mrkdwn",
            text: `\n:white_check_mark: *Passed Tests:${passCount}*`
          },
        },
        {
          type: "section",
          text: {

            type: "mrkdwn",
            text: `\n:white_medium_square: *Skipped Tests:${skipCount}*`
          },
        },
        {
          type: "section",
          text: {

            type: "mrkdwn",
            text: `\n:link: *Git URL:${jobUrl}*`
          },
        },
      ],
    };
    axios
      .post(slackWebHookURL, message)
      .then(response => {
        console.log('Slack notification sent successfully');
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to send Slack notification:', error.message);
      });
  });
}
sendSlackNotification();