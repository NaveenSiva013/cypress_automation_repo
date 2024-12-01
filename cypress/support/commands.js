import { getXpath } from '../e2e/pageObjects';
import 'cypress-iframe';
import { registerCommand } from 'cypress-wait-for-stable-dom'
registerCommand()

var xpathTimeout = { "timeout": Cypress.env(xpathTimeout) }

let stored_data;

function getRandomString() {
	stored_data = Math.random().toString(36).substring(7);
	return 'random_' + stored_data;
}

Cypress.Commands.add('accessWebsite', () => {
	cy.visit('/');
});

Cypress.Commands.add('accessDirectUrl', (url) => {
	const page = url.replaceAll(' ', '_').toLowerCase();
	let page_url = Cypress.env(page)
	cy.visit(page_url, {
		failOnStatusCode: false,
	});
});

Cypress.Commands.add('accessExternalUrl', (url) => {
	cy.visit(url, {
		failOnStatusCode: false,
	});
});

Cypress.Commands.add('verifyTitle', (title) => {
	cy.title().should('include', title);
});

Cypress.Commands.add('verifyUrl', (url) => {
	cy.url().should('include', url);
});

Cypress.Commands.add('waitForStableDOMCommand', (url) => {
	cy.waitForStableDOM({ pollInterval: 1000, timeout: 10000 })
});

Cypress.Commands.add('clickOnTheElement', (locator_name, page_name) => {
	cy.verifyElementIsVisible(locator_name, page_name);
	//cy.waitForStableDOM({ pollInterval: 1000, timeout: 10000 })
	cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).trigger('mouseover').click({ force: true });
});

Cypress.Commands.add('clickOnTheFirstElement', (locator_name, page_name) => {
	cy.verifyElementIsVisible(locator_name, page_name);
	cy.xpath(getXpath(page_name, locator_name)).eq(0).click({ force: true });
});

Cypress.Commands.add('clickOnTheNthElement', (locator_name, page_name, index) => {
	cy.verifyElementIsVisible(locator_name, page_name);
	cy.xpath(getXpath(page_name, locator_name)).eq(index - 1).click({ force: true });
});

Cypress.Commands.add('clickOnTheRandomElement', (locator_name, page_name) => {
	cy.xpath(objects[page][locator]).its('length').then((count) => {
		const selected = Cypress._.random(count - 1); // lower = 0 is default
		cy.xpath(getXpath(page_name, locator_name)).eq(selected).click(); // saving the text as an alias to be used later
	});
});

Cypress.Commands.add('verifyElementIsVisible', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).should('be.visible');
});

Cypress.Commands.add('enterTheValue', (locator_name, page_name, value) => {
	if (value.includes('automationuser')) {
		const userName = Cypress.env(value);
		cy.log(userName)
		cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).clear({ force: true }).type(userName);
	} else {
		cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).clear().type(value);
	}
});

// This method will mask the entering value while executing in debug view
Cypress.Commands.add('enterTheMaskedValue', (locator_name, page_name, value) => {
	cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).clear().type(value, { log: false });
})

Cypress.Commands.add('selectByValue', (value, locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).select(value);
});

Cypress.Commands.add('selectByIndex', (value, locator_name, page_name) => {
	cy.log(getXpath(page_name, locator_name));
	cy.xpath(getXpath(page_name, locator_name) + '//option')
		.eq(value)
		.then((element) => cy.xpath(getXpath(page_name, locator_name)).select(element.val()));
});

Cypress.Commands.add('enterTheValueFromFixture', (locator_name, page_name, fixture_name, value) => {
	cy.fixture(fixture_name).then(function (data) {
		const test_data = data[value.replaceAll(' ', '_')];
		cy.xpath(getXpath(page_name, locator_name)).clear().type(test_data);
	});
});

Cypress.Commands.add('verifyTextIsDisplayed', (locator_name, page_name, value) => {
	if (value.includes('automationuser')) {
		const userName = Cypress.env(value);
		cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).should('contain', userName);
	} else if (value.includes('stored')) {
		cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).should('contain', stored_data);
	} else {
		cy.xpath(getXpath(page_name, locator_name)).should('contain', value);
	}
});

Cypress.Commands.add('verifyTextIsNotDisplaying', (locator_name, page_name, value) => {
	if (value.includes('saved')) {
		cy.get('@saved_data').then((saved_data) => {
			cy.log(saved_data);
			cy.xpath(getXpath(page_name, locator_name)).should('not.have.text', saved_data);
			cy.log(saved_data);
		});
	} else {
		cy.xpath(getXpath(page_name, locator_name)).should('not.have.text', value);
	}
});

Cypress.Commands.add('verifyTextFromFixtureIsDisplayed', (locator_name, page_name, fixture_name, value) => {
	cy.fixture(fixture_name).then(function (data) {
		let test_data = data[value.replaceAll(' ', '_')];
		cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).should('contain', test_data);
	});
});

Cypress.Commands.add('verifyMinimumCount', (locator_name, expected_count, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).its('length').should('be.gte', expected_count);
});

Cypress.Commands.add('verifyElementIsNotDisplayed', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).should('not.exist');
});

Cypress.Commands.add('verifyValueIsNotEmpty', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).then(($elment) => {
		const data = $elment.text();
		Cypress.env(stored_data, data);
		cy.wrap(data).as('saved_data');
	});
});

Cypress.Commands.add('getInnerText', (locator_name, page_name) => {
	const innerText = cy.xpath(getXpath(page_name, locator_name)).then(($elment) => {
		$elment.text();
	});
	cy.log(innerText)
	return innerText;
});

Cypress.Commands.overwrite('scrollIntoView', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).scrollIntoView();
});

Cypress.Commands.add('waitForSeconds', (seconds) => {
	cy.wait(seconds * 1000);
});

Cypress.Commands.add('forceVisit', (url) => {
	cy.window().then((win) => {
		return win.open(url, '_self');
	});
});

Cypress.Commands.add('openNewTabLink', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name)).invoke('removeAttr', 'target').click({ force: true });
});

Cypress.Commands.add('clickOnTheFirstElement', (locator_name, page_name) => {
	cy.verifyElementIsVisible(locator_name, page_name);
	cy.xpath(getXpath(page_name, locator_name)).eq(0).click({ force: true });
});

Cypress.Commands.add('switchIframeClick', (iframe, locator_name, page_name) => {
	cy.frameLoaded(iframe);
	cy.iframe(iframe).within(() => {
		cy.xpath(getXpath(page_name, locator_name)).click({ force: true });
	});
});

Cypress.Commands.add('switchIframeEnterText', (iframe, text, locator_name, page_name) => {
	cy.frameLoaded(iframe);
	cy.iframe(iframe).within(() => {
		cy.xpath(getXpath(page_name, locator_name)).type(text);
	});
});

Cypress.Commands.add('cleartext', (locator_name, page_name) => {
	cy.xpath(getXpath(page_name, locator_name), { xpathTimeout }).clear({ force: true });
});