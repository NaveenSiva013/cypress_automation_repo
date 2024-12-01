const report = require("multiple-cucumber-html-reporter");
require('dotenv').config()
report.generate({
  
  jsonDir: process.env.REPORT_JSON_DIR, // ** Path of .json file **//
  reportPath: process.env.REPORT_DIRECTORY,
  hideMetadata: true
  // metadata: {
  //   browser: {
  //     name: "chrome",
  //     version: "XX",
  //   },
  //   device: "Local test machine",
  //   platform: {
  //     name: "Windows",
  //     version: "11",
  //   },
  // },
});
