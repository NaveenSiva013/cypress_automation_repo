const axios = require('axios');
const util = require('./testLinkUtil.js')

const apiUrl = process.env.URL+'/lib/api/xmlrpc/v1/xmlrpc.php'; // get the value from env file
const devKey = process.env.DEVKEY
const projectId = process.env.PROJECTID
const projectName = process.env.PROJECTNAME
var planId = process.env.PLANID 
var buildId = process.env.BUILDID
const user = process.env.USER
const activeAtt = process.env.ACTIVE_ATT
const publicAtt = process.env.PUBLIC_ATT
const testPlanName = process.env.TEST_PLAN_NAME
const testPlanNotes = process.env.TEST_PLAN_NOTES    
const testCaseResults = util.getTestIDAndStatus();

/* @function getTestLinkVersion() 
    This method is to get the TestLink version of the configured URL
*/
async function getTestLinkVersion(){
    var	obj = { 
        methodName: "testLinkVersion",
        devKey: { value: devKey, type: 'string' }
    }
    var version = await apiRequest(obj)
    console.log(version)
    return version
}

/* @function - updateRestToTestLink()
    This method is to create the Plan and Build ID if Plan ID and Build ID is not provided
    But Plan name has to be given.
    Then it will update the results based on the the getTestIDAndStatus method.
*/
async function updateStatusToTestLink(){
    if (testCaseResults !=""){
        if (planId == "" && buildId == ""){
            planId = await createPlan(testPlanName,testPlanNotes);
            await addAllTestCasesToPlan(testCaseResults,planId)
            buildId = await createBuild(planId)
        }else if(buildId == ""){
            buildId = await createBuild(planId)
        }else{
            console.log("Plan ID--"+planId+"Build ID--"+buildId)
        }
        await updateAllTCStatus(testCaseResults)
    }else{
        console.log('No Testcase To Upload')
        return
    }  
}

/* @function - createPlan()
    This method will create a TestPlan based on the Project ID provided in the .env file
    Return Plan ID
*/
async function createPlan(testPlanName,notes){
    var	obj = { 
        methodName: "createTestPlan",
        devKey: { value:devKey, type: 'string' },
        testprojectname:{ value:projectName,type:'string'},
        testplanname:{ value:testPlanName, type:'string'},
        notes:{value:notes,type:'string'},
        active:{value:activeAtt,type:'boolean'},
        public:{value:publicAtt,type:'boolean'},
    }
    var response = await apiRequest(obj) // Making API Request
    const response_message = getMessage(response)
    console.log("Create Plan -- "+response_message )
    if(response_message == "Success!"){
       const plan_id = getId(response)
        console.log("Created Plan Id : "+plan_id)
        return plan_id
    }else{
        console.log("Message : "+response_message)
        return
    }
}

/* @function - createBuild()
    This method is to create Build by taking the input of PlanID
    Return the created buildID
*/
async function createBuild(plan_ID){
    var newBuildId= "Build-"+util.getTimeStamp()
    var obj = {
        methodName: "createBuild",
        devKey: { value:devKey, type: 'string' },
        testplanid:{value:plan_ID, type: 'int'},
        buildname: {value:newBuildId, type: 'string'},
        buildnotes: {value: "Created from Cypress Suite", type: 'string'}
    }
    var response = await apiRequest(obj)
    const response_message = getMessage(response)
    console.log("Create Build -- "+response_message )
    if(response_message == "Success!"){
        const build_id = getId(response)
         console.log("Created Build Id : "+build_id)
         return build_id
     }else{
        console.log("Message : "+response_message)
     }
}

/* @function - addTestCasesToPlan
    This method is to add single test case, It takes the test_id and version as main parameter
*/
async function addTestCasesToPlan(testcaseid,planId){
    const tcversion = await getTestCaseVersion(testcaseid)
    var obj = {
        methodName: "addTestCaseToTestPlan",
        devKey: { value:devKey, type: 'string' },
        testprojectid:{value:projectId, type: 'string'},
        testplanid:{value:planId,type:'int'},
        testcaseid:{value:testcaseid, type: 'string'},
        version:{value:tcversion,type:'int'}
    }
    await apiRequest(obj); // no success message from testlink response
    console.log("Added Test Case to the Plan - "+ testcaseid + ", version-" + tcversion);
}

/* @function - getTestCaseVersion
    This method is to get the test case details along with the latest version details
    For addTestCasesToPlan, to add latest version to the test plan
    Return testcase version for testid
*/
async function getTestCaseVersion(testcaseid){
    var obj = {
        methodName: "getTestCase",
        devKey: { value:devKey, type: 'string' },
        testprojectid:{value:projectId, type: 'string'},
        testcaseid:{value:testcaseid, type: 'string'},
    }
    var response = await apiRequest(obj);
    var response_version = getVersion(response)
    if(response_version){
        return response_version
    } else{
        response_version = "No Version Found"
        return response_version
    }
}

/* @function getVersion 
    This method is to extract the version from the response that we are getting from getTestCase.
    Extraction is done using Regex expression of the xml response
    Returns Version from the XML Response
*/
function getVersion(response){
    const versionRegex = /<name>version<\/name><value><string>(.*?)<\/string><\/value>/
    var version = ""
    var match = versionRegex.exec(response);
    if(match){
        version = match[1];
    }
    return version;
}

/* @function addAllTestCasesToPlan
    This method is to add all the test cases based on the TestCaseID array
    Since Testlink is not supporting bulk adding the test cases into plan
    We have to add each test cases using loop
*/
async function addAllTestCasesToPlan(testCaseResults,planId){
    return new Promise((resolve,reject)=>{
        testCaseResults.forEach(({testCaseId,status})=>{
            try {
                resolve(addTestCasesToPlan(testCaseId,planId))
            }catch (error){
                console.error("Error updating test result:", error);
                } 
            })
    })
}

/*@function updateTestResult 
    This method is to update the Test Result on single test case
    It will take the input of TestCase Id and Status
*/
async function updateTestResult(testCaseId,status){
    var	obj = { 
        methodName: "reportTCResult",
        devKey: { value:devKey, type: 'string' },
        testplanid:{value:planId, type: 'int'},
        buildid:{value:buildId, type: 'string'},
        buildnotes:{value:"Execution from Cypress Suite", type: 'string'},
        testcaseid:{value:testCaseId, type: 'string'},
        notes:{value:"Automated Execution", type: 'string'},
        status:{value:status, type: 'string'},
        platformname:{value:"Windows", type: 'string'},
        user:{value:user, type: 'string'}
    }
    var response = await apiRequest(obj);
    const response_message = getMessage(response)
    console.log("Execution Status for "+testCaseId+"--"+response_message)
}

/*@function updateAllTCStatus
    This method is to update the Test Result all using the loop
    TestLink is not supporting bulk update, hence we are updating the test result one by one 
*/
async function updateAllTCStatus(test_case_results){
    return new Promise((resolve,reject)=>{
    console.log(test_case_results);
    test_case_results.forEach(({testCaseId, status})=>{
        try {
            resolve(updateTestResult(testCaseId, status))
        }catch (error){
            console.error("Error updating test result:", error);
            } 
        })
    })
}

/* @function - getMessage 
    This will take the XML string reponse and extract the message
    Extraction is done using Regex from the xml response
    Returns message from the XML Response
*/
function getMessage(response){
    const messageRegex = /<name>message<\/name><value><string>(.*?)<\/string><\/value>/
    var message = ""
    var match = messageRegex.exec(response);
    if(match){
        message = match[1];
    }else{
        console.log("No Message Found")
    }
    return message;
}

/* @function - getID
    This will take the XML string response and extract the id (created)
    Extraction is done using Regex from the xml response
*/
function getId(response){
    const idRegex = /<name>id<\/name><value><int>(.*?)<\/int><\/value>/
    var id = ""
    var match = idRegex.exec(response);
    if(match){
        id = match[1];
    }else{
        console.log("No Message Found")
    }
    return id;
}

/* @function - apiRequest
    This will make the API request with TestLink based on the xml input
*/
async function apiRequest(obj){
    try{
        var object = util.getRequestByObject(obj)
        //console.log(object);
        const response = await axios.post(apiUrl,object , {
            headers: {
                'Content-Type': 'application/xml',
            },
            })
            if (response.status === 200){
                const results = response.data
                //console.log(results);
                return results
            } else {
                console.log('Unexpected status: '+ response.status);
            }
    }
    catch(error){
                // Handle errors
                console.log('Unexpected status: '+ error);
        };
    }

updateStatusToTestLink()