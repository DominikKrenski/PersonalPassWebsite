describe('REGISTRATION PROCESS', () => {
  before(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
  });

  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should register user', () => {
    cy.get('input[name="email"]').type('krenska.dorota@yahoo.com');
    cy.get('input[name="password"]').type('Guziki1302@!');
    cy.get('input[name="passwordConfirm"]').type('Guziki1302@!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/signup');
  });

  it('should not register user if email is already in use', () => {
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('DKrenski@05_08_1984!');
    cy.get('input[name="passwordConfirm"]').type('DKrenski@05_08_1984!');
    cy.get('button[type="submit"]').click();

    cy.get('#server-error-body p').should('have.text', 'Istnieje już konto powiązane z danym adresem email');
  });
})
