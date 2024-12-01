import {
  Given, When, Then
} from "@badeball/cypress-cucumber-preprocessor";

Given('I delete all mails for {string}', (user) => {
  cy.task("deleteAllMails", {
    options: {
      gmailUser: user
    }
  }).then(message => {
    cy.log(message)

  })
});

When('I registered a new user', () => {
  cy.log('Add steps for registration')
});

Then('I read OTP from the {string} and apply in the textbox', (user) => {
  cy.task("getMatchingMails", {
    options: {
      searchQuery: {
        from: "no-reply@dev.dehn.de",
        //from: "msonlineservicesteam@microsoftonline.com",
        //subject: "Registration letter",
      },
      timeoutInMilliseconds: 20000, //Timeout in milliseconds. The test will wait for the mail
      gmailUser: user
    }
  }).then((message) => {
    // cy.log(message)
    const emailbody = message;
    const otpPattern = /\b\d{6}\b/;
    cy.wrap(emailbody).then((emailbody) => {
      const otp = emailbody.match(otpPattern)[0];
      cy.log('OTP:', otp);
      cy.enterTheValue("forgot_password_verification_textbox", "resetpassword", otp);
    })
  })
});


