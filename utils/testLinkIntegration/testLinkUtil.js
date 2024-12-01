const fs = require('fs');
require('dotenv').config()
const scenario_prefix = process.env.PROJECT_PREFIX

// Read the JSON file
const rawData = fs.readFileSync(process.env.REPORT_JSON_PATH);
const results = JSON.parse(rawData);

function getTestIDAndStatus(){
    const testCasesToUpdate = [];
    results.forEach(feature => {
        feature.elements.forEach(scenario => {
        const testCaseIdTag = scenario.tags.find(tag => tag.name.startsWith("@"+scenario_prefix+"-"));    
        if (testCaseIdTag) {
            const testCaseId = testCaseIdTag.name.slice(7); // Remove the '@ prefix from .env file -' prefix
            const status = scenario.steps.every(step => step.result.status === 'passed') ? 'p' : 'f';    
            testCasesToUpdate.push({ testCaseId, status });
        }
        });
    });
    return testCasesToUpdate 
}

function getTimeStamp(){
    const currentDate = new Date();
  
      // Format the date components
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = currentDate.getFullYear();
  
      // Format the time components
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
      // Create the formatted timestamp string
      const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      return formattedTimestamp
  }

function getRequestByObject(object) {
        var xmlResponse 	= "",
            methodCall 		= "",
            parallelTag 	= "",
            oneLabelArray 	= "";
        for (var property in object) {
            if (property === "methodName") {
                methodCall = '<methodName>tl.' + object[property] + '</methodName>\n';
            }
            else
            {
                if (Array.isArray(object[property])) {
                    var recursiveTags = "";
                    object[property].map(function(tag) {
                        recursiveTags = recursiveTags + '<member><name>' + tag.name + '</name><value><' + tag.type + '>' + tag.value + '</' + tag.type + '></value></member>\n';
                    });
    
                    oneLabelArray = oneLabelArray + '<member><name>' + property + '</name><value><struct>\n' + recursiveTags + '</struct></value></member>';
                }
                else {
                    parallelTag = parallelTag + '<member><name>' + property + '</name><value>' +
                        '<' + object[property].type + '>' + object[property].value + '</' + object[property].type + '></value></member>\n';
                }
            }
    
        } //End of loop
    
        xmlResponse = '<?xml version="1.0"?>\n' +
            '<methodCall>\n' +
            methodCall +
            '<params>' +
            '<param><value><struct>\n' +
            parallelTag +
            oneLabelArray +
            '</struct></value></param>\n' +
            '</params></methodCall>';
        return xmlResponse;
    } 

module.exports = {
    getRequestByObject,
    getTestIDAndStatus,
    getTimeStamp
};