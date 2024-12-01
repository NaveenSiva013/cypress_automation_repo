import {
	Given, Then, When
} from "@badeball/cypress-cucumber-preprocessor";
require('dotenv').config()
const password = Cypress.env('userPassword');

Given('I login to the website as {string} in {string} view', (userName, device) => {

	if (device == 'desktop') {
		cy.viewport(1440, 900);
	}
	else if (device == 'mobile') {
		cy.viewport(360, 780);
	}
	else if (device == 'tablet') {
		cy.viewport(768, 1024);
	}

	cy.visit('/');
	cy.verifyElementIsVisible("username textbox", "loginpage");
	cy.enterTheValue("username textbox", "loginpage", userName)
	cy.enterTheMaskedValue("password textbox", "loginpage", password)
	cy.clickOnTheElement("login_button", "loginpage")

});

Then('I logout from the website in {string} view', (device) => {
	if (device == 'desktop') {
		cy.clickOnTheElement("logout_button", "homepage");
	}
	else if (device == 'mobile') {
		cy.selectByValue("Ausloggen", "home_menu", "homepage");
	}

	cy.waitForStableDOMCommand()
	cy.verifyElementIsVisible("login button", "landing page");
});

When('I enter new random password in new password page', () => {
	const randomNumbers = Math.floor(Math.random() * 1000);
	cy.log(randomNumbers);
	const Password = `testpassword@${randomNumbers}`;
	cy.enterTheMaskedValue("new_password_textbox", "newpassword", Password);
})