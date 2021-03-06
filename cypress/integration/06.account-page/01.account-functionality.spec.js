const { expect } = require('chai');

describe('ACCOUNT FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy.get('#secure-nav ul li:last-child a').click({force: true});
  });

  it('should display proper validation messages if new email has been not provided', () => {
    cy
    .get('#login-details-table button')
    .then(buttons => {
      cy.wrap(buttons[0]).click();
      cy.get('button[type="submit"]').click();
      cy.get('.validation-message ul li')
    }).then(msgs => {
      expect(msgs).to.have.length(2);
    })
  });

  it('should display format error message if email is invalid', () => {
    cy
      .get('#login-details-table button')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('input[name="email"]').type('dominik');
        cy.get('button[type="submit"]').click();
        cy.get('.validation-message ul li')
      })
      .then(msgs => {
        expect(msgs).to.have.length(1)
      });
  });

  it('should close change email form if new email is the same as the old one', () => {
    cy
      .get('#login-details-table button')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
        cy.get('button[type="submit"]').click();
        cy.get('#email-form-wrapper').should('not.exist');
      });
  });

  it('should change email address', () => {
    cy
      .get('#login-details-table button')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('input[name="email"]').type('dominik@yahoo.com');
        cy.get('button[type="submit"]').click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[0]).should('contain.text', 'dominik@yahoo.com');
      });
  });

  it('should display password reminder', () => {
    cy
      .get('#login-details-table button')
      .then(buttons => {
        cy.wrap(buttons[3]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[2]).should('contain.text', 'Taka sobie prosta, nic nie wnosz??ca wiadomo????');
        cy.get('button');
      })
      .then(buttons => {
        cy.wrap(buttons[4]).should('contain.text', 'Ukryj wskaz??wk??');
      });
  });

  it('should hide password reminder', () => {
    cy
      .get('#login-details-table button')
      .then(buttons => {
        cy.wrap(buttons[3]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)')
      })
      .then(rows => {
        cy.wrap(rows[2]).should('contain.text', 'Taka sobie prosta, nic nie wnosz??ca wiadomo????');
        cy.get('button')
      })
      .then(buttons => {
        cy.wrap(buttons[4]).click();
        cy.get('#login-details-table tbody tr td:nth-child(2)');
      })
      .then(rows => {
        cy.wrap(rows[2]).not('contain.text', 'Taka sobie prosta, nic nie wnosz??ca wiadomo????')
        cy.get('button')
      })
      .then(buttons => {
        cy.wrap(buttons[4]).should('contain.text', 'Poka?? wskaz??wk??');
      });
  });

  it('should change display language to english', () => {
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
    cy
      .get('#account-info-table button')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('#confirmation-body').should('have.text', 'Czy chcesz usun???? konto?');
        cy.get('#confirmation-wrapper button')
      })
      .then(buttons => {
        cy.wrap(buttons[0]).click();
      });
  });

  it('should delete account', () => {
    cy
      .get('#account-info-table button')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('#confirmation-wrapper button')
      })
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.url().should('be.equal', 'https://personal-pass.dev/')
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
