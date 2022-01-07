const { expect } = require("chai");
const db = require('../../../src/app/utils/DatabaseService');

describe('LOGIN FUNCTIONALITY', () => {
  before(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
  });

  beforeEach(() => {
    cy.visit('/signin');
  });

  it('should login user dominik.krenski@gmail.com', () => {
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy
      .url()
      .should('contain', '/secure');

    cy
      .window()
      .then(wnd => {
        expect(wnd.sessionStorage.getItem('account_id')).equal('771aa756-f064-41d0-9937-62468c7784c2');
        expect(wnd.sessionStorage.getItem('refresh_vector')).is.not.null;
        expect(wnd.sessionStorage.getItem('private_vector')).is.not.null;
        expect(wnd.sessionStorage.getItem('access_vector')).is.not.null;

        return db.accounts.where('account_id').equals('771aa756-f064-41d0-9937-62468c7784c2').first();
      })
      .then(entry => {
        expect(entry.account_id).equal('771aa756-f064-41d0-9937-62468c7784c2');
        expect(entry.master_key).is.not.null;
        expect(entry.access_token).is.not.null;
        expect(entry.refresh_token).is.not.null;
      });
  });

  it('should login user dorciad@interia.pl', () => {
    cy.get('input[name="email"]').type('dorciad@interia.pl');
    cy.get('input[name="password"]').type('Guziki1302@!');
    cy.get('button[type="submit"]').click();

    cy
      .url()
      .should('contain', '/secure');

      cy
      .window()
      .then(wnd => {
        expect(wnd.sessionStorage.getItem('account_id')).equal('f378a1cc-0360-4f01-886b-e568861ff7f3');
        expect(wnd.sessionStorage.getItem('refresh_vector')).is.not.null;
        expect(wnd.sessionStorage.getItem('private_vector')).is.not.null;
        expect(wnd.sessionStorage.getItem('access_vector')).is.not.null;

        return db.accounts.where('account_id').equals('f378a1cc-0360-4f01-886b-e568861ff7f3').first();
      })
      .then(entry => {
        expect(entry.account_id).equal('f378a1cc-0360-4f01-886b-e568861ff7f3');
        expect(entry.master_key).is.not.null;
        expect(entry.access_token).is.not.null;
        expect(entry.refresh_token).is.not.null;
      });
  });

  it('should return error response if email is invalid', () => {
    cy.get('input[name="email"]').type('dominik.krenski@yahoo.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy.get('#server-error-body p').should('have.text', 'Konto nie istnieje');
  });

  it('should return error response if password is invalid', () => {
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('DKrenski@05_08_1984!');
    cy.get('button[type="submit"]').click();

    cy.get('#server-error-body p').should('have.text', 'Adres email lub hasło nie jest poprawne');
  })
});
