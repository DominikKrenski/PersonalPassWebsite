const { expect } = require('chai');

describe('FORGOT PASSWORD FUNCTIONALITY', () => {
  before(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
  });

  beforeEach(() => {
    cy.visit('/signin');
  });

  it('should display proper form', () => {
    cy.get('#password-hint a').click();
    cy.url().should('contain', '/password-hint');
    cy.get('input').should('have.prop', 'name', 'email');
  });

  it('should change input class if email was not provided', () => {
    cy.get('#password-hint a').click();
    cy.url().should('contain', '/password-hint');
    cy.get('button').click();

    cy.get('input[name="email"]').should('have.class', 'error');
    cy.on('window:alert', txt => {
      expect(txt).to.equal('Musisz wprowadzić swój adres email');
    });
  });

  it('should change input class if email is not valid', () => {
    cy.get('#password-hint a').click();
    cy.url().should('contain', '/password-hint');
    cy.get('input[name="email"]').type('dominik@');
    cy.get('button').click();

    cy.get('input[name="email"]').should('have.class', 'error');
    cy.on('window:alert', txt => {
      expect(txt).to.equal('Musisz wprowadzić swój adres email');
    });
  });

  it('should display error message if given email does not exist', () => {
    cy.get('#password-hint a').click();
    cy.url().should('contain', '/password-hint');
    cy.get('input[name="email"]').type('dominik.krenski@yahoo.com');
    cy.get('button').click();

    cy.get('#server-error-body p').should('have.text', 'Konto nie istnieje');
  });

  it('should send email with password hint and redirect to /signin', () => {
    cy.get('#password-hint a').click();
    cy.url().should('contain', '/password-hint');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('button').click();
    cy.url().should('contain', '/signin');
  })
})
