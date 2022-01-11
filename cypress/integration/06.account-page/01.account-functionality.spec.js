const { expect } = require('chai');
const db = require('../../../src/app/utils/DatabaseService');

describe('ACCOUNT FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();
  });

  it('should display proper validation messages if new email has been not provided', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
    .get('button')
    .then(buttons => {
      cy.wrap(buttons[1]).click();
      cy.get('button[type="submit"]').click();
      cy.get('.validation-message ul li')
    }).then(msgs => {
      expect(msgs).to.have.length(2);
    })
  });

  it('should display format error message if email is invalid', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.get('input[name="email"]').type('dominik');
        cy.get('button[type="submit"]').click();
        cy.get('.validation-message ul li')
      })
      .then(msgs => {
        expect(msgs).to.have.length(1)
      });
  });

  it('should close change email form if new email is the same as the old one', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
        cy.get('button[type="submit"]').click();
        cy.get('#email-form-wrapper').should('not.exist');
      });
  });

  it('should change email address', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.get('input[name="email"]').type('dominik@yahoo.com');
        cy.get('button[type="submit"]').click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[0]).should('contain.text', 'dominik@yahoo.com');

      });
  });

  it('should display password reminder', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[4]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[2]).should('contain.text', 'Taka sobie prosta, nic nie wnosząca wiadomość');
        cy.get('button');
      })
      .then(buttons => {
        cy.wrap(buttons[4]).should('contain.text', 'Ukryj wskazówkę');
      });
  });

  it('should hide password reminder', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[4]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[2]).should('contain.text', 'Taka sobie prosta, nic nie wnosząca wiadomość');
        cy.get('button')
      })
      .then(buttons => {
        cy.wrap(buttons[4]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)');
      })
      .then(rows => {
        cy.wrap(rows[2]).not('contain.text', 'Taka sobie prosta, nic nie wnosząca wiadomość')
        cy.get('button')
      })
      .then(buttons => {
        cy.wrap(buttons[4]).should('contain.text', 'Pokaż wskazówkę');
      });
  });

  it('should change display language to english', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('select')
      .then(selects => {
        cy.wrap(selects[0]).select('en');
        cy.get('#login-details-table th').should('contain.text', 'Login Data');
        cy.get('#account-info-table th').should('contain.text', 'Account Information');
        cy.get('select');
      })
      .then(selects => {
        cy.wrap(selects[0]).select('pl');
      })
  });

  it('should display delete account confirmation', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[5]).click();
        cy.get('#confirmation-body').should('have.text', 'Czy chcesz usunąć konto?');
        cy.get('#confirmation-wrapper button')
      })
      .then(buttons => {
        cy.wrap(buttons[0]).click();
      });
  });

  it('should delete account', () => {
    cy.get('#secure-nav ul li:last-child a').click();
    cy.wait(2000);

    cy
      .get('button')
      .then(buttons => {
        cy.wrap(buttons[5]).click();
        cy.get('#confirmation-wrapper button')
      })
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.wait(5000);
        cy.window()
      })
      .then(wnd => {
        expect(wnd.sessionStorage.getItem('private_vector')).to.be.null;
        expect(wnd.sessionStorage.getItem('access_vector')).to.be.null;
        expect(wnd.sessionStorage.getItem('refresh_vector')).to.be.null;
        expect(wnd.sessionStorage.getItem('account_id')).to.be.null;
      })
  })
})
