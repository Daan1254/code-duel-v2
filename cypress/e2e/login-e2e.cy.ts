describe("Login E2E Tests", () => {
  beforeEach(() => {
    // Visit login page before each test
    cy.visitLogin();
  });

  it("should display the login form correctly", () => {
    // Check if all form elements are present
    cy.get('[data-testid="email-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");
    cy.get('[data-testid="forgot-password-button"]').should("be.visible");
    cy.get('[data-testid="signup-link"]').should("be.visible");

    // Check form title and description
    cy.contains("Login").should("be.visible");
    cy.contains("Login to your account to continue").should("be.visible");
  });

  it("should handle login with invalid credentials", () => {
    // Test with invalid credentials - this will make real API call
    cy.get('[data-testid="email-input"]').type("invalid@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    cy.get('[data-testid="login-button"]').click();

    // Wait for error message from real API
    cy.get('[data-testid="error-message"]', { timeout: 10000 })
      .should("exist")
      .and("be.visible");
  });

  it("should successfully login with valid credentials", () => {
    // Use real credentials - make sure this user exists in your database
    cy.login("daan@frostup.com", "Test123!");

    // Should redirect to dashboard after real login
    cy.url().should("include", "/dashboard");
  });

  it("should navigate to signup page when clicking signup link", () => {
    cy.get('[data-testid="signup-link"]').click();
    cy.url().should("include", "/register");
  });

  it("should test programmatic login via API", () => {
    // Test direct API login
    cy.loginAPI("daan@frostup.com", "Test123!");

    // After API login, visit dashboard directly
    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard");
  });
});
