const { expect } = require('chai');

describe('UPDATE PASSWORD FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy.get('#secure-nav ul li:last-child a').click();
  });

  it('should not update password if old and new are the same', () => {
    cy
    .get('#login-details-table button')
    .then(btns => {
      cy.wrap(btns[2]).click();
      cy.get('input[name="oldPassword"]').type('Dominik1984!');
      cy.get('input[name="newPassword"]').type('Dominik1984!');
      cy.get('input[name="newPasswordConfirm"]').type('Dominik1984!');
      cy.get('button[type="submit"]').click();

      cy.wait(2000);

      return cy.get('#login-details-table button')
    })
    .then(btns => {
      cy.wrap(btns[3]).click();

      cy.get('#login-details-table tbody tr:last-child td:last-child').should('contain.text', 'Taka sobie prosta, nic nie wnosząca wiadomość');
    });
  });

  it('should display proper error message if old password is wrong', () => {
    cy
      .get('#login-details-table button')
      .then(btns => {
        cy.wrap(btns[2]).click();
        cy.get('input[name="oldPassword"]').type('Dominik1984@');
        cy.get('input[name="newPassword"]').type('DKrenski@05_08_1984!');
        cy.get('input[name="newPasswordConfirm"]').type('DKrenski@05_08_1984!');
        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        cy.get('#server-error-body p').should('contain.text', 'Brak uprawnień do zmiany hasła');
      });
  });

  it('should change password without reminder', () => {
    cy
      .get('#login-details-table button')
      .then(btns => {
        cy.wrap(btns[2]).click();
        cy.get('input[name="oldPassword"]').type('Dominik1984!');
        cy.get('input[name="newPassword"]').type('DKrenski@05_08_1984!');
        cy.get('input[name="newPasswordConfirm"]').type('DKrenski@05_08_1984!');
        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        return cy.get('#login-details-table button')
    })
    .then(btns => {
      cy.wrap(btns[3]).click();
      cy.get('#login-details-table tbody tr:last-child td:last-child').not('contain.text', 'Taka sobie prosta, nic nie wnosząca wiadomość');
    });
  });

  it('should change password along with reminder', () => {
    cy
      .get('#login-details-table button')
      .then(btns => {
        cy.wrap(btns[2]).click();
        cy.get('input[name="oldPassword"]').type('Dominik1984!');
        cy.get('input[name="newPassword"]').type('DKrenski@05_08_1984!');
        cy.get('input[name="newPasswordConfirm"]').type('DKrenski@05_08_1984!');
        cy.get('input[name="reminder"]').type('nowa wiadomość')
        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        return cy.get('#login-details-table button')
    })
    .then(btns => {
      cy.wrap(btns[3]).click();
      cy.get('#login-details-table tbody tr:last-child td:last-child').should('contain.text', 'nowa wiadomość');
    });
  })
})
