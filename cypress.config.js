const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const { deleteAllMessages, getMatchingMessages} = require("./utils/mailHelper")
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");

require('dotenv').config()


async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  config.env = {
    ...process.env,
    ...config.env
  }

  on("file:preprocessor", browserify.default(config));
  on('task', {
    'deleteAllMails': async (args) => {
      return deleteAllMessages(args)
    }
  });
 
  on('task', {
    'getMatchingMails': async (args) => {
      return getMatchingMessages(args)
    }
  });
  
  return config;
}

module.exports = defineConfig({
  e2e: {
    specPattern: [
      'cypress/e2e/features/desktop/*.feature',
      'cypress/e2e/features/mobile/*.feature',
      'cypress/e2e/features/tablet/*.feature',
      // Add more paths as needed
    ],
    baseUrl: "https://www.saucedemo.com",
    screenshotsFolder: process.env.SCREENSHOT_FOLDER,
    video: false,
    setupNodeEvents,
    // experimentalSessionAndOrigin: true,
    chromeWebSecurity: false,
    supportFile: "cypress/support/e2e.js"
  },
  env: {  
      test_automationuser: "standard_user",
      userPassword: process.env.user_password,
      automationuser: "mailintegrationuser@gmail.com",  
      xpathTimeout:60000,
      plp_page:"inventory-item.html?id=5"
    },
});

require('@applitools/eyes-cypress')(module);