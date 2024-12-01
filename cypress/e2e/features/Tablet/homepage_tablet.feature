Feature:Mobile Home Page Features

@regression @tablet @TC_ID-7
Scenario: Test to validate logout functionality
        Given I login to the website as "test_automationuser" in "tablet" view
        Then I validated "home page heading" is visible on "home page"
        And I validated "menu options" is visible on "home page"
        When I click on the "menu options" on "home page"
        Then I validated "logout button" is visible on "home page"
        When I click on the "logout button" on "home page"
        Then I validated "login button" is visible on "login page"