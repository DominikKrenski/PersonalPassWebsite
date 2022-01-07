const { expect } = require('chai');

describe('ITEMS FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();
  });

  it('should display nine entries', () => {
    cy
      .get('#data-table table tbody tr')
      .then(rows => {
        expect(rows).to.have.length(9);
      });
  });

  it ('should display TEŚCIOWA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[7]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'TEŚCIOWA');
        cy.get('input[name="firstName"]').should('have.value', 'Bogumiła');
        cy.get('input[name="middleName"]').should('have.value', 'Elżbieta');
        cy.get('input[name="lastName"]').should('have.value', 'Drewek');
        cy.get('input[name="birthday"]').should('have.value', '1953-12-31');
        cy.get('input[name="company"]').should('have.value', '');
        cy.get('input[name="addressOne"]').should('have.value', 'Radzyń Wieś 4A');
        cy.get('input[name="addressTwo"]').should('have.value', '');
        cy.get('input[name="city"]').should('have.value', '');
        cy.get('input[name="country"]').should('have.value', '');
        cy.get('input[name="state"]').should('have.value', 'kujawsko-pomorskie');
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="mobilePhone"]').should('have.value', '+48691766512');
        cy.get('input[name="notes"]').should('have.value', 'przykładowy adres teściowej');
      });
  });

  it('should display ENERGA 24', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[2]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'ENERGA 24');
        cy.get('input[name="url"]').should('have.value', 'https://energa24.pl');
        cy.get('input[name="username"]').should('have.value', 'krenska.dorota');
        cy.get('input[name="password"]').should('have.value', 'Guzik1302@');
        cy.get('textarea[name="notes"]').should('have.value', 'Cholerne rachunki za prąd');
      });
  });

  it('should display NOTATKA 1', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[5]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'NOTATKA 1');
        cy.get('textarea[name="message"]').should('have.value', 'Zwykła testowa notatka.');
      });
  });

  it('should display UCZELNIA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(btns => {
        cy.wrap(btns[8]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'UCZELNIA');
        cy.get('input[name="url"]').should('have.value', 'https://pg.edu.gda.pl');
      });
  });

  it('should update UCZELNIA', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[8]).click();
        cy.get('input[name="entryTitle"]').clear().type('POLITECHNIKA GDAŃSKA');
        cy.get('input[name="url"]').clear().type('https://pg.gda.pl');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.get('#secure-nav a');
      })
      .then(links => {
        cy.wrap(links[3]).click();
        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'POLITECHNIKA GDAŃSKA');
        cy.get('input[name="url"]').should('have.value', 'https://pg.gda.pl');
      });
  });

  it('should update TEŚCIOWA', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[7]).click();
        cy.get('input[name="entryTitle"]').clear().type('1. TEŚCIOWA');
        cy.get('input[name="middleName"]').clear().type('Ewa');
        cy.get('input[name="city"]').clear().type('Radzyń Chełmiński');
        cy.get('input[name="country"]').type('Polska');
        cy.get('input[name="notes"]').clear();
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.get('#secure-nav a');
      })
      .then(links => {
        cy.wrap(links[2]).click();
        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', '1. TEŚCIOWA');
        cy.get('input[name="firstName"]').should('have.value', 'Bogumiła');
        cy.get('input[name="middleName"]').should('have.value', 'Ewa');
        cy.get('input[name="lastName"]').should('have.value', 'Drewek');
        cy.get('input[name="birthday"]').should('have.value', '1953-12-31');
        cy.get('input[name="company"]').should('have.value', '');
        cy.get('input[name="addressOne"]').should('have.value', 'Radzyń Wieś 4A');
        cy.get('input[name="addressTwo"]').should('have.value', '');
        cy.get('input[name="city"]').should('have.value', 'Radzyń Chełmiński');
        cy.get('input[name="country"]').should('have.value', 'Polska');
        cy.get('input[name="state"]').should('have.value', 'kujawsko-pomorskie');
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="mobilePhone"]').should('have.value', '+48691766512');
        cy.get('input[name="notes"]').should('have.value', '');
      });
  });

  it('should should update NOTATKA 1', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[2]).click();
        cy.get('input[name="entryTitle"]').clear().type('1. Energa');
        cy.get('input[name="url"]').clear();
        cy.get('input[name="password"]').clear().type('DKrenski@05_08_1984!');
        cy.get('textarea[name="notes"]').clear().type('Bardzo drogi prąd');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.get('#secure-nav a');
      })
      .then(links => {
        cy.wrap(links[1]).click();
        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', '1. Energa');
        cy.get('input[name="url"]').should('have.value', '');
        cy.get('input[name="username"]').should('have.value', 'krenska.dorota');
        cy.get('input[name="password"]').should('have.value', 'DKrenski@05_08_1984!');
        cy.get('textarea[name="notes"]').should('have.value', 'Bardzo drogi prąd');
      });
  });

  it('should update NOTATKA 1', () => {
    cy
      .get('#data-table button.is-info')
      .then(btns => {
        cy.wrap(btns[5]).click();
        cy.get('input[name="entryTitle"]').clear().type('a.NOTE');
        cy.get('textarea[name="message"]').clear().type('Zaktualizowana notatka');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
        cy.get('#secure-nav a');
      })
      .then(links => {
        cy.wrap(links[4]).click();
        cy.get('#data-table button.is-primary');
      })
      .then(btns => {
        cy.wrap(btns[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'a.NOTE');
        cy.get('textarea[name="message"]').should('have.value', 'Zaktualizowana notatka');
      });
  });

  it('should delete specific entries', () => {
    cy
      .get('#data-table button.is-danger')
      .then(btns => {
        cy.wrap(btns[1]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);

        cy.wrap(btns[4]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);

        cy.wrap(btns[6]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);

        cy.wrap(btns[3]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);

        cy.get('#data-table tbody tr')
      })
      .then(rows => {
        expect(rows).to.have.length(5);

        cy.get('#secure-nav a')
      })
      .then(links => {
        // check passwords
        cy.wrap(links[1]).click();
        cy.get('#data-table tbody tr td:nth-child(2)').should('have.text', 'ENERGA 24');

        // check addressess
        cy.wrap(links[2]).click();
        cy
          .get('#data-table tbody tr td:nth-child(2)')
          .each(entry => {
            cy.wrap(entry).not('have.text', 'MAMA')
          });

        // check websites
        cy.wrap(links[3]).click();
        cy.get('#data-table tbody tr td:nth-child(2)').should('have.text', 'UCZELNIA');

        // check notes
        cy.wrap(links[4]).click();
        cy.get('#data-table tbody tr td:nth-child(2)').should('have.text', 'NOTATKA 1');
      });
  });
});
