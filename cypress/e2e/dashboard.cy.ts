describe("Dashboard Tests", () => {
  it("should access dashboard after successful login using visitDashboard command", () => {
    // Use real login and navigation
    cy.visitDashboard();

    // Dashboard should be accessible
    cy.url().should("include", "/dashboard");

    // Add specific dashboard tests here based on your dashboard content
    // For example:
    // cy.get('[data-testid="dashboard-header"]').should('be.visible');
    // cy.get('[data-testid="user-profile"]').should('contain', 'Daan');
  });

  it("should redirect to login when accessing dashboard without authentication", () => {
    // Try to visit dashboard directly without login
    cy.visit("/dashboard");

    // Should be redirected to login page
    cy.url().should("include", "/login");
    cy.get('[data-testid="login-form"]').should("be.visible");
  });

  it("should handle expired token gracefully", () => {
    // Set an obviously expired/invalid token
    cy.window().then((window) => {
      window.localStorage.setItem("token", "invalid-expired-token");
    });

    // Try to access dashboard
    cy.visit("/dashboard");

    // Should be redirected to login due to 401 handling
    cy.url().should("include", "/login");
  });

  it("should maintain authentication state across page reloads", () => {
    // Login first using real authentication
    cy.visitDashboard();

    // Verify we're on dashboard
    cy.url().should("include", "/dashboard");

    // Reload the page
    cy.reload();

    // Should still be on dashboard (token should persist)
    cy.url().should("include", "/dashboard");
  });

  it("should handle logout functionality", () => {
    // Login first using real authentication
    cy.visitDashboard();

    // If you have a logout button, test it
    // cy.get('[data-testid="logout-button"]').click();
    // cy.url().should('include', '/login');

    // Or manually clear token and try to access protected resource
    cy.window().then((window) => {
      window.localStorage.removeItem("token");
    });

    // Try to access dashboard again
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });

  it("should work with programmatic API login", () => {
    // Test API login followed by dashboard access
    cy.loginAPI("daan@frostup.com", "Test123!");

    // Visit dashboard after API login
    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard");
  });
});
