require('dotenv').config()
module.exports={
    "nonGlobalStepDefinitions": true,
    "json": {
      "enabled": true,
      "output": process.env.REPORT_JSON_PATH,
    },
    "messages": {
      "enabled": true,
      "output": process.env.REPORT_JSON_MESSAGE_PATH,
    },
    "filterSpecs": true,
    "omitFiltered": true  
}