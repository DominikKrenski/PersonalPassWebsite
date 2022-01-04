describe('ROUTE GUARD FUNCTIONALITY', () => {
  before(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy
      .window()
      .then(wnd => {
        wnd.sessionStorage.clear()
      });
  });

  it('should redirect to /signin if user tries to access secure area without login', () => {
    cy.visit('/secure');
    cy.url().should('contain', '/signin');
  });

  it('should display secure area if user has been logged in', () => {
    cy.visit('/secure');
    cy.url().should('contain', '/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();
    cy.url().should('contain', '/secure');
  })
})
