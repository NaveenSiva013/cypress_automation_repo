import {
	Then
} from "@badeball/cypress-cucumber-preprocessor";

/**
 * Validate the page title
 *  @param {string} title - The title of the page
 */
Then('I validated the page title contain {string}', (title) => {
	cy.verifyTitle(title);
});

/**
 * Validate the page url
 *  @param {string} url - The url of the page
 */
Then('I validated that the url should contain {string}', (url) => {
	cy.verifyUrl(url);
});

/**
 * Verify if the element contains a text
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
Then('I validated {string} is visible on {string}', (locator_name, page_name) => {
	cy.verifyElementIsVisible(locator_name, page_name);
});

/**
 * Verify if the element contains a text
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 *  @param {string} value - The value that should be entered as as text
 */
Then('I validated the {string} should contain {string} on {string}', (locator_name, value, page_name) => {
	cy.verifyTextIsDisplayed(locator_name, page_name, value);
});

/**
 * Verify if the element NOT contains a text
 *  @param {string} locator_name - The locator of the element
 *  @param {string} value - The value that should be entered as text
 *  @param {string} page_name - The page name containing the element
 */
Then('I validated that the text in the {string} is not {string} on {string}', (locator_name, value, page_name) => {
	cy.verifyTextIsNotDisplaying(locator_name, page_name, value);
});

/**
 * Verify if the element in page contains a text on a fixture
 *  @param {string} locator_name - The locator of the element
 *  @param {string} value - The value that should be entered as as text
 *  @param {string} fixture_name - The fixture containing the element
 *  @param {string} page_name - The page name containing the element
 */
Then(
	'I validated the {string} should contain {string} from {string} fixture on {string}',
	(locator_name, value, fixture_name, page_name) => {
		cy.verifyTextFromFixtureIsDisplayed(locator_name, page_name, fixture_name, value);
	}
);

/**
 * Verify if there are minimum count of element
 *  @param {string} locator_name - The locator of the element
 *  @param {int} expected_count - The value that should be entered as as text
 *  @param {string} fixture_name - The fixture containing the element
 */
Then(
	'I validated that the count of {string} should have atleast {int} on {string}',
	(locator_name, expected_count, page_name) => {
		cy.verifyMinimumCount(locator_name, expected_count, page_name);
	}
);

/**
 * Verify if element is NOT displayed
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The value that should be entered as as text
 */
Then('I validated that the {string} is not displayed on {string}', (locator_name, page_name) => {
	cy.verifyElementIsNotDisplayed(locator_name, page_name);
});

/**
 * Wait for 5 seconds
 */
Then('I wait for {int} seconds before the next action', (seconds) => {
	cy.waitForSeconds(seconds);
});

Then('I reloaded the page', () => {
	cy.reload();
});

Then('I validated {string} on {string} is not empty and save it', (locator_name, page_name) => {
	cy.verifyValueIsNotEmpty(locator_name, page_name);
});

/**
 * Scroll to the element in the page
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The value that should be entered as as text
 */
Then('I scroll to {string} on {string} ', (locator_name, page_name) => {
	cy.scrollIntoView(locator_name, page_name);
});

Then('I wait for DOM complete page load', () => {
	cy.waitForStableDOMCommand();
});