Feature: Home Page Features

@regression @desktop @TC_ID-2 @TL-ID-114472
Scenario: Test to validate logout functionality
        Given I Initiate applitools setup on "Home Page"
        Given I login to the website as "test_automationuser" in "desktop" view
        Then I validated "home page heading" is visible on "home page"
        And I validate the visual testing on the "logout button"
        And I validated "menu options" is visible on "home page"
        When I click on the "menu options" on "home page"
        Then I validated "logout button" is visible on "home page"
        And I validate the visual testing on the "home page"
        When I click on the "logout button" on "home page"
        Then I validated "login button" is visible on "login page"
        And I Closed the applitools setup

@regression @desktop @TC_ID-2 @TL-ID-114472
Scenario: Test to validate logout functionality - 01
        Given I Initiate applitools setup on "Home Page"
        When I click on first mail