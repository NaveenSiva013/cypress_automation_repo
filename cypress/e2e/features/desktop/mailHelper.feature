Feature: Mail Helper Feature

@regression @desktop @TC_ID-5
Scenario: Test to validate delete mails
        Given I delete all mails for "reset_automationuser"
        And I navigate to the website