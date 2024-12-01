Feature: Login Page Features

 
@regression @desktop @TC_ID-3 @TL-ID-114490
Scenario: Test to validate errors for empty email and password  
        Given I navigate to the website
        Then I validated "username textbox" is visible on "login page"
        When I click on the "login button" on "login page"
        Then I validated "invalid error" is visible on "login page"
       
@regression @desktop @TC_ID-4 @TL-ID-114322
Scenario: Test to validate login with valid user credentials 
        Given I login to the website as "test_automationuser" in "desktop" view
        Then I validated "home page heading" is visible on "home page"