import {
	When
  } from "@badeball/cypress-cucumber-preprocessor";

/**
 * Click on the element in page
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I click on the {string} on {string}', (locator_name, page_name) => {
	cy.clickOnTheElement(locator_name, page_name);
});

/**
 * Click on the first element in page
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */

When('I click on the first {string} from {string}', (locator_name, page_name) => {
	cy.clickOnTheFirstElement(locator_name, page_name);
});

/**
 * Click on the random element in page
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I click on the random {string} from {string}', (locator_name, page_name) => {
	cy.clickOnTheRandomElement(locator_name, page_name);
});

/**
 * Click on the nth element in page
 *  @param {int} index - The index of the element
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I click on the index {int}the {string} from {string}', (index, locator_name, page_name) => {
	cy.clickOnTheNthElement(index, locator_name, page_name);
});

/**
 * Click on the random element in page
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I click on the random {string} from {string}', (locator_name, page_name) => {
	cy.clickOnTheRandomElement(locator_name, page_name);
});

/**
 * Enter text on locator_name
 *  @param {string} value - The value that should be entered as as text
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I enter {string} in {string} on {string}', (value, locator_name, page_name) => {
	cy.clickOnTheElement(locator_name, page_name);
	cy.enterTheValue(locator_name, page_name, value);
});

/**
 * Click on the nth element in page
 *  @param {string} value - The value that should be entered as as text
 *  @param {string} fixture_name - The fixture containing the element
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When(
	'I enter {string} from {string} fixture in {string} on {string}',
	(value, fixture_name, locator_name, page_name) => {
		cy.clickOnTheElement(locator_name, page_name);
		cy.enterTheValueFromFixture(locator_name, page_name, fixture_name, value);
	}
);

/**
 * Click on the back button on browser
 */
When('I click on the browser back', () => {
	cy.go('back');
});

/**
 * Click on the refresh button on browser
 */
When('I refresh the page', () => {
	cy.reload();
});

/**
 * Select on the dropdown element by value in page
 *  @param {string} value - The value that should be selected
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I select {string} from {string} on {string}', (value, locator_name, page_name) => {
	cy.selectByValue(value, locator_name, page_name);
});

/**
 * Select on the dropdown element by index in page
 *  @param {int} index - The index of the element
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I select index {int} from {string} on {string}', (value, locator_name, page_name) => {
	cy.selectByIndex(value, locator_name, page_name);
});

/**
 * Clicking on the first mail in mailaintor
 */

When('I click on first mail', () => {
	cy.clickFirstMail();
});

/**
 * Clicking on the Json section in mailaintor
 */

When('I click on json section', () => {
	cy.clickJsonSection();
});

/**
 *  @param {string} element - The locator of the element 
 *  @param {string} page - The page name containing the element
 */

When('I open {string} from {string} on the current tab', (element, page) => {
	cy.openNewTabLink(element, page);
});

/**
 *  @param {string} iframe - The iframe containing the element 
 *  @param {string} element - The locator of the element 
 *  @param {string} page - The page name containing the element
 */
When('I switch to {string} iframe and click on {string} in {string}', (iframe, element, page) => {
	cy.switchIframeClick(iframe, element, page);
});

/**
 *  @param {string} iframe - The iframe containing the element 
 *  @param {string} text - The text of the element 
 *  @param {string} element - The locator of the element 
 *  @param {string} page - The page name containing the element
 */
When('I switch to {string} iframe and enter {string} on {string} in {string}', (iframe, text, element, page) => {
	cy.switchIframeEnterText(iframe, text, element, page);
});

When('I clear the textbox {string} in {string}', (element, page) => {
	cy.cleartext(element, page);
});

/**
 * Click on the nth element in page
 *  @param {string} value - The value that should be entered as as text
 *  @param {string} fixture_name - The fixture containing the element
 *  @param {string} locator_name - The locator of the element
 *  @param {string} page_name - The page name containing the element
 */
When('I enter masked {string} in {string} on {string}', (value, locator_name, page_name) => {
	cy.clickOnTheElement(locator_name, page_name);
	cy.enterTheMaskedValue(locator_name, page_name, value);
});

When('I Initiate applitools setup on {string}',(page)=>{
	cy.eyesOpen({
		appName: 'VisualTesting Cypress',
		testName: page
	})
})

When('I Closed the applitools setup',()=>{
	cy.eyesClose();
})

When('I validate the visual testing on the {string}',(page)=>{
	cy.eyesCheckWindow(page)
})