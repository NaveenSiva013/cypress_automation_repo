import {
	Given
  } from "@badeball/cypress-cucumber-preprocessor";

/**
 * Navigate to the base url
 */
Given('I navigate to the website', () => {
	cy.accessWebsite();	
});

/**
 * Navigate to the base url + extended
 */
Given('I directly navigate to the {string}', (page) => {
	cy.accessDirectUrl(page);
});

Given('I navigate to the {string}', (url) => {
	cy.accessExternalUrl(url);
});