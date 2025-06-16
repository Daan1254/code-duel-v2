describe("Subscription Tests", () => {
  beforeEach(() => {});

  it("should open invoices portal from stripe", () => {
    // cy.get('[data-testid="subscription-button"]').click();
    cy.visitDashboard();

    cy.get('[data-testid="invoices-button"]').click();

    cy.wait(2000);

    cy.origin("https://billing.stripe.com", () => {
      cy.url().should("include", "https://billing.stripe.com/");
    });
  });
});
