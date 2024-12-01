Feature: Cross Origin Issue Helper

@regression @desktop @TC_ID-1 @TL-ID-114352
Scenario: Test to validate cross origin functionality
        Given I navigate to the "https://www.amazon.in/"
        Then I validated "amazon australia link" is visible on "home page"
        When I click on the "amazon australia link" on "home page"
        Then I verify amazon australia home page