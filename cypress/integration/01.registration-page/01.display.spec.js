describe('REGISTRATION PAGE DISPLAY', () => {
  it('should display registration form', () => {
    cy.visit('/signup');
    cy.get('form').should('have.length', 1);
    cy.get('password-requirements').should('not.exist');
  });

  it('should display password requirements when password got focus', () => {
    cy.visit('/signup');
    cy.get('input[type="password"]').first().focus();
    cy.get('#password-requirements').should('have.length', 1);
  });

  it('should change password field after clicking on eye icon', () => {
    cy.visit('/signup');
    cy.get('input[name="password"]').as('passwordField');
    cy.get('@passwordField').should('have.attr', 'type', 'password');
    cy.get('#eye-icon').click();
    cy.get('@passwordField').should('have.attr', 'type', 'text');
    cy.get('#eye-icon').click();
    cy.get('@passwordField').should('have.attr', 'type', 'password');
  });
})
