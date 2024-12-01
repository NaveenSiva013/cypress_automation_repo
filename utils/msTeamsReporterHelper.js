const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const path = require("path");

async function sendMSTeamsReportNotification() {
  return new Promise((resolve, reject) => {
    const teamsWebHookURL = process.env.TEAMS_WEBHOOK;
    let jobUrl = "Local execution";

    if (process.env.BITBUCKET_GIT_HTTP_ORIGIN) {
      jobUrl = `${process.env.BITBUCKET_GIT_HTTP_ORIGIN}/pipelines/results/${process.env.BITBUCKET_BUILD_NUMBER}`;
    }

    const rootPath = path.resolve(__dirname, ".."); // Assuming the .env is in the parent director
    process.chdir(rootPath);

    const reportData = JSON.parse(
      fs.readFileSync(process.env.REPORT_JSON_PATH, "utf8")
    );

    // Initialize counters
    let totalScenarios = 0;
    let passCount = 0;
    let failCount = 0;
    let skipCount = 0;

    reportData.forEach((feature) => {
      if (feature.elements) {
        feature.elements.forEach((scenario) => {
          totalScenarios++;
          const allStepsSkipped = scenario.steps.every(
            (step) => step.result.status === "skipped"
          );
          if (allStepsSkipped) {
            skipCount++;
          } else {
            const allStepsPassed = scenario.steps.every(
              (step) => step.result.status === "passed"
            );
            if (allStepsPassed) {
              passCount++;
            } else {
              failCount++;
            }
          }
        });
      }
    });

    // Print the results
    console.log(`Total Scenarios: ${totalScenarios}`);
    console.log(`Pass Count: ${passCount}`);
    console.log(`Fail Count: ${failCount}`);
    console.log(`Skip Count: ${skipCount}`);

    const date = new Date().toLocaleDateString();
    const message = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: "Cypress Test Report",
      themeColor: "0076D7",
      sections: [
        {
          activityTitle: `Cypress Test Report-${date}`,
          activitySubtitle: "Test Results Summary",
          facts: [
            {
              name: "Total Tests Scenarios -",
              value: totalScenarios.toString(),
            },
            {
              name: "❌ Failed Tests :",
              value: failCount.toString(),
            },
            {
              name: "✅ Passed Tests :",
              value: passCount.toString(),
            },
            {
              name: "🔗 Pipeline Report :",
              value: `[View Report](${jobUrl})`,
            },
          ],
          markdown: true,
        },
      ],
    };
    axios
      .post(teamsWebHookURL, message)
      .then((response) => {
        console.log("Teams notification sent successfully");
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Failed to send Teams notification:", error.message);
      });
  });
}
sendMSTeamsReportNotification();