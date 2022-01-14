const { expect } = require('chai');

describe('APP COUNTER FUNCTIONALITY', () => {
  before(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
  });

  beforeEach(() => {
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();
  });

  it('should logout automatically', () => {
    cy.wait(120000);
    cy.url().should('contain', 'https://personal-pass.dev');
    cy
      .window()
      .then(wnd => {
        expect(wnd.sessionStorage.getItem('account_id')).is.null;
        expect(wnd.sessionStorage.getItem('refresh_vector')).is.null;
        expect(wnd.sessionStorage.getItem('private_vector')).is.null;
        expect(wnd.sessionStorage.getItem('access_vector')).is.null;
      });
  });

  it('should return to home page after logout button click', () => {
    cy.wait(2000);
    cy.get('#logout-button-wrapper button').click();
    cy.url().should('contain', 'https://personal-pass.dev');
    cy.wait(2000);

    cy
      .window()
      .then(wnd => {
        expect(wnd.sessionStorage.getItem('account_id')).is.null;
        expect(wnd.sessionStorage.getItem('refresh_vector')).is.null;
        expect(wnd.sessionStorage.getItem('private_vector')).is.null;
        expect(wnd.sessionStorage.getItem('access_vector')).is.null;
      });
  });
});
