/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to visit the login page
       * @example cy.visitLogin()
       */
      visitLogin(): Chainable<void>;

      /**
       * Custom command to visit dashboard with real authentication
       * @example cy.visitDashboard()
       */
      visitDashboard(): Chainable<void>;

      /**
       * Custom command to login programmatically with real API
       * @example cy.loginAPI('user@example.com', 'password123')
       */
      loginAPI(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add("visitLogin", () => {
  cy.visit("/login");
  cy.get('[data-testid="login-form"]').should("be.visible");
});

Cypress.Commands.add("loginAPI", (email: string, password: string) => {
  // Make real API call for login
  cy.request({
    method: "POST",
    url: `http://localhost:3000/api/auth/login`,
    body: {
      email: email,
      password: password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property("access_token");

    window.localStorage.setItem("token", response.body.access_token);
  });
});

Cypress.Commands.add("visitDashboard", () => {
  // Use real login via UI
  cy.visitLogin();
  cy.login("daan@frostup.com", "Test123!");

  // Wait for successful login and redirect
  cy.url().should("include", "/dashboard");

  // Wait for dashboard to fully load
  cy.wait(1000);
});

export {};
