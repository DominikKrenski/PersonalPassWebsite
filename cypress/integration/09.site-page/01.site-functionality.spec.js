const { expect } = require('chai');

describe('SITE FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy
      .get('#secure-nav ul a')
      .then(anchors => {
        cy.wrap(anchors[3]).click({force: true});
      });
  });

  it('should display two sites', () => {
    cy
      .get('#data-table tbody tr td:nth-child(2)')
      .then(rows => {
        expect(rows).to.have.length(2);
        cy.wrap(rows[0]).should('contain.text', 'STRONA DOMOWA');
        cy.wrap(rows[1]).should('contain.text', 'UCZELNIA');
      });
  });

  it('should display two error messages if title and url are not set', () => {
    cy.get('#add-site-icon').click({force: true});
    cy.get('button[type="submit"]').click({force: true});
    cy
      .get('.validation-message')
      .each(msg => {
        cy.wrap(msg).should('have.text', 'Pole jest wymagane');
      });
  });

  it('should display one error message if title is not set', () => {
    cy.get('#add-site-icon').click({force: true});
    cy.get('input[name="url"]').type('https://play24.pl');
    cy.get('button[type="submit"]').click({force: true});
    cy.get('.validation-message').should('have.text', 'Pole jest wymagane');
  });

  it('should display one error message if url is not set', () => {
    cy.get('#add-site-icon').click({force: true});
    cy.get('input[name="entryTitle"]').type('PLAY');
    cy.get('button[type="submit"]').click({force: true});
    cy.get('.validation-message').should('have.text', 'Pole jest wymagane');
  });

  it('should create new site', () => {
    cy.get('#add-site-icon').click({force: true});
    cy.get('input[name="entryTitle"]').type('PLAY');
    cy.get('input[name="url"]').type('https://play24.pl');
    cy.get('button[type="submit"]').click({force: true});

    cy.wait(2000);

    cy
      .get('#data-table table tbody tr')
      .then(rows => {
        expect(rows).to.have.length(3);
      });
  });

  it('should display STRONA DOMOWA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[0]).click({force: true});
        cy.get('input[name="entryTitle"]').should('have.value', 'STRONA DOMOWA');
        cy.get('input[name="url"]').should('have.value', 'https://dominik-krenski.ovh');
      });
  });

  it('should display UCZELNIA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[1]).click({force: true});
        cy.get('input[name="entryTitle"]').should('have.value', 'UCZELNIA');
        cy.get('input[name="url"]').should('have.value', 'https://pg.edu.gda.pl');
      });
  });

  it('should update STRONA DOMOWA', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[0]).click({force: true});
        cy.get('input[name="entryTitle"]').clear().type('PERSONAL PASS');
        cy.get('input[name="url"]').clear().type('https://pass.dominik-krenski.ovh');
        cy.get('button[type="submit"]').click({force: true});

        cy.wait(2000);

        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click({force: true});
        cy.get('input[name="entryTitle"]').should('have.value', 'PERSONAL PASS');
        cy.get('input[name="url"]').should('have.value', 'https://pass.dominik-krenski.ovh');
      });
  });

  it('should update UCZELNIA', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[1]).click({force: true});
        cy.get('input[name="entryTitle"]').clear().type('POLITECHNIKA GDAŃSKA');
        cy.get('button[type="submit"]').click({force: true});

        cy.wait(2000);

        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'POLITECHNIKA GDAŃSKA');
        cy.get('input[name="url"]').should('have.value', 'https://pg.edu.gda.pl');
      });
  });

  it('should delete STRONA DOMOWA', () => {
    cy
      .get('#data-table button.is-danger')
      .then(btns => {
        cy.wrap(btns[0]).click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});

        cy.wait(2000);

        cy.get('#data-table table tbody tr')
      })
      .then(rows => {
        expect(rows).to.have.length(1);
      });
  });

  it('should delete UCZELNIA', () => {
    cy
      .get('#data-table button.is-danger')
      .then(btns => {
        cy.wrap(btns[1]).click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});

        cy.wait(2000);

        cy.get('#data-table table tbody tr td:nth-child(2)').should('have.text', 'STRONA DOMOWA');
      });
  });

  it('should delete all sites', () => {
    cy
      .get('#data-table button.is-danger')
      .then(btns => {
        cy.wrap(btns[0]).click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});

        cy.wait(2000);

        cy.get('#data-table button.is-danger').click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});

        cy.wait(2000);

        cy.get('#data-table').should('not.exist');
      });
  });
});
