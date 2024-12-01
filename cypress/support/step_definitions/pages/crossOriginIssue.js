import {
	Given, Then
} from "@badeball/cypress-cucumber-preprocessor";


Then('I verify amazon australia home page', () => {
	cy.origin('https://www.amazon.com.au/', () => {
		cy.get("a:contains('Your Account')").should('be.visible')

	})
});

//This code serves as a reference for how to pass parameters into the cy.origin function.
Given('I login to the website as {string}', (userName) => {
	cy.clickOnTheElement("login button", "landing page")
	cy.origin('https://dehnauthstage.b2clogin.com/',
		{ args: { userName, password } },
		({ userName, password }) => {
			const email = Cypress.env(userName);
			const user_password = Cypress.env(userName + '_password');

			cy.get('#signInName', { timeout: 60000 }).should('be.visible');
			cy.get('#signInName').type(email)
			cy.get('#password').type(user_password, { log: false })
			cy.get("button[id='next']").click()
		})
	cy.get("h2[data-qa-id='home-authenticated-heading']").should('be.visible')

});