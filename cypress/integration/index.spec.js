describe("Index", () => {
  it("should display the page correctly if a user is not logged in", () => {
    cy.visit("/")
      .get("h1")
      .contains("All Users")
      .get(".navbar-burger")
      .click()
      .get("a")
      .contains("User Status")
      .should("not.be.visible")
      .get("a")
      .contains("Log Out")
      .should("not.be.visible")
      .get("a")
      .contains("Register")
      .get("a")
      .contains("Log In")
      .get("a")
      .contains("Swagger")
      .get(".notification.is-success")
      .should("not.be.visible");

    cy.get("footer").contains("Copyright 2019 TestDriven.io.").should("exist");
  });
});
