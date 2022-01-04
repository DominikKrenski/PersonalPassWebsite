describe('LOGIN FORM VALIDATION', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('should display all validation messages is email is empty', () => {
    cy.get('input[name="password"]').type('dakjdla');
    cy.get('button[type="submit"]').click();

    cy
      .get('.validation-message ul li')
      .then($li => {
        expect($li).to.have.length(2);
        cy.wrap($li[0]).should('have.text', 'Pole jest wymagane');
        cy.wrap($li[1]).should('have.text', 'Email nie jest poprawny');
      });
  });

  it('should display email format error if email is not valid', () => {
    cy.get('input[name="email"]').type("dominik.krenski");
    cy.get('input[name="password"]').type("dafdsdf");
    cy.get('button[type="submit"]').click();

    cy.get('.validation-message ul li').should('have.text', 'Email nie jest poprawny');
  });

  it('should display required message if password is an empty string', () => {
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('   ');
    cy.get('button[type="submit"]').click();

    cy.get('.validation-message ul li').should('have.text', 'Pole jest wymagane');
  });

  it('should display required message if password is not filled in', () => {
    cy.get('input[name="email"]').type('dominik.krenski@gmal.com');
    cy.get('button[type="submit"]').click();

    cy.get('.validation-message ul li').should('have.text', 'Pole jest wymagane');
  })
})
