const { expect } = require('chai');

describe('PASSWORD FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy
      .get('#secure-nav ul a')
      .then(anchors => {
        cy.wrap(anchors[1]).click();
      });
  });

  it('should display two passwords', () => {
    cy
      .get('#data-table tbody tr td:nth-child(2)')
      .then(rows => {
        expect(rows).to.have.length(2);
        cy.wrap(rows[0]).should('have.text', 'ENERGA 24');
        cy.wrap(rows[1]).should('have.text', 'GMAIL');
      });
  });

  it('should display three error messages if title, user and password are not set', () => {
    cy.get('#add-password-icon').click();
    cy.get('button[type="submit"]').click();
    cy
      .get('.validation-message')
      .then(msgs => {
        expect(msgs).to.have.length(3);
      });
  });

  it('should display error message if title is not set', () => {
    cy.get('#add-password-icon').click();
    cy.get('input[name="username"]').type('dominik.krenski');
    cy.get('input[name="password"]').type('Dominik1984');
    cy.get('button[type="submit"]').click();
    cy
      .get('.validation-message')
      .then(msgs => {
        expect(msgs).to.have.length(1);
      });
  });

  it('should display error message if username is not set', () => {
    cy.get('#add-password-icon').click();
    cy.get('input[name="entryTitle"]').type('CHOMIKUJ');
    cy.get('input[name="password"]').type('Dominik1984');
    cy.get('button[type="submit"]').click();
    cy
      .get('.validation-message')
      .then(msgs => {
        expect(msgs).to.have.length(1);
      })
  });

  it('should display error message if password is not set', () => {
    cy.get('#add-password-icon').click();
    cy.get('input[name="entryTitle"]').type('CHOMIKUJ');
    cy.get('input[name="username"]').type('dominik.krenski');
    cy.get('button[type="submit"]').click();
    cy
      .get('.validation-message')
      .then(msgs => {
        expect(msgs).to.have.length(1);
      });
  });

  it('should add new password', () => {
    cy.get('#add-password-icon').click();
    cy.get('input[name="entryTitle"]').type('CHOMIKUJ');
    cy.get('input[name="username"]').type('dominik.krenski');
    cy.get('input[name="password"]').type('Dominik1984');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy
      .get('#data-table table tbody tr')
      .then(rows => {
        expect(rows).to.have.length(3);
      });
  });

  it('should display ENERGA 24', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'ENERGA 24');
        cy.get('input[name="url"]').should('have.value', 'https://energa24.pl');
        cy.get('input[name="username"]').should('have.value', 'krenska.dorota');
        cy.get('input[name="password"]').should('have.value', 'Guzik1302@');
        cy.get('textarea[name="notes"]').should('have.value', 'Cholerne rachunki za prąd');
      });
  });

  it('should display GMAIL', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[1]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'GMAIL');
        cy.get('input[name="url"]').should('have.value', '');
        cy.get('input[name="username"]').should('have.value', 'dominik.krenski@gmail.com');
        cy.get('input[name="password"]').should('have.value', 'DKrenski@05_08_1984!');
        cy.get('textarea[name="notes"]').should('have.value', '');
      });
  });

  it('should update ENERGA 24', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').clear().type('PRĄD');
        cy.get('input[name="url"]').clear();
        cy.get('textarea[name="notes"]').type(' coraz to wyższe');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.get('#data-table button.is-primary')
      })
      .then(btns => {
        cy.wrap(btns[1]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'PRĄD');
        cy.get('input[name="url"]').should('have.value', '');
        cy.get('input[name="username"]').should('have.value', 'krenska.dorota');
        cy.get('input[name="password"]').should('have.value', 'Guzik1302@');
        cy.get('textarea[name="notes"]').should('have.value', 'Cholerne rachunki za prąd coraz to wyższe');
      });
  });

  it('should delete all passwords', () => {
    cy
      .get('#data-table button.is-danger')
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table button.is-danger').click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table').should('not.exist');
      });
  });
});
