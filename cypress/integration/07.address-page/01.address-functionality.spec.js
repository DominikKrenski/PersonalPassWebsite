const { expect } = require('chai');

describe('ADDRESS FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy
      .get('#secure-nav ul a')
      .then(anchors => {
        cy.wrap(anchors[2]).click();
      });
  });

  it('should display three addresses', () => {
    cy
      .get('#data-table tbody tr td:nth-child(2)')
      .then(tds => {
        expect(tds).to.have.length(3);
        cy.wrap(tds[0]).should('contain.text', 'ADRES DOMOWY');
        cy.wrap(tds[1]).should('contain.text', 'MAMA');
        cy.wrap(tds[2]).should('contain.text', 'TEŚCIOWA');
      })
  });

  it('should display error message if title is not set', () => {
    cy.get('#add-address-icon').click();
    cy.get('button[type="submit"]').click();
    cy.get('.validation-message').should('have.text', 'Pole jest wymagane');
  });

  it('should create address entry', () => {
    cy.get('#add-address-icon').click();
    cy.get('input[name="entryTitle"]').type('ADRES TESTOWY');
    cy.get('input[name="firstName"]').type('Marcelina');
    cy.get('input[name="lastName"]').type('Zawadzka');
    cy.get('input[name="city"]').type('Bydgoszcz');
    cy.get('input[name="state"]').type('kujawsko-pomorskie');
    cy.get('input[name="notes"]').type('Śmierć odeń gorzką nie więcej być może.');
    cy.get('button[type="submit"]').click();

    cy.wait(2000);

    cy
      .get('#data-table table tbody tr')
      .then(rows => {
        expect(rows).to.have.length(4);
      });
  });

  it('should display ADRES DOMOWY', () => {
    cy
      .get('#data-table button.is-primary')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'ADRES DOMOWY');
        cy.get('input[name="firstName"]').should('have.value', 'Dominik');
        cy.get('input[name="middleName"]').should('have.value', '');
        cy.get('input[name="lastName"]').should('have.value', 'Kreński');
        cy.get('input[name="birthday"]').should('have.value', '1984-08-05');
        cy.get('input[name="company"]').should('have.value', 'DOMINIK KREŃSKI');
        cy.get('input[name="addressOne"]').should('have.value', 'ul. Urocza 11A/4');
        cy.get('input[name="addressTwo"]').should('have.value', '');
        cy.get('input[name="city"]').should('have.value', 'Juszkowo');
        cy.get('input[name="country"]').should('have.value', 'Polska');
        cy.get('input[name="state"]').should('have.value', 'pomorskie');
        cy.get('input[name="email"]').should('have.value', 'dominik.krenski@gmail.com');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="mobilePhone"]').should('have.value', '+48 536 969 171');
        cy.get('input[name="notes"]').should('have.value', 'adres domowy');
      })
  });

  it('should display MAMA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'MAMA');
        cy.get('input[name="firstName"]').should('have.value', 'Helena');
        cy.get('input[name="middleName"]').should('have.value', '');
        cy.get('input[name="lastName"]').should('have.value', 'Soboczyńska');
        cy.get('input[name="birthday"]').should('have.value', '1956-08-13');
        cy.get('input[name="company"]').should('have.value', 'Apteka "Korzenna"');
        cy.get('input[name="addressOne"]').should('have.value', 'Kruczkowskiego 4A/11 81-597 Gdynia');
        cy.get('input[name="addressTwo"]').should('have.value', '');
        cy.get('input[name="city"]').should('have.value', 'Gdynia');
        cy.get('input[name="country"]').should('have.value', '');
        cy.get('input[name="state"]').should('have.value', 'pomorskie');
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="mobilePhone"]').should('have.value', '537-412-107');
        cy.get('input[name="notes"]').should('have.value', '');
      });
  });

  it('should display TEŚCIOWA', () => {
    cy
      .get('#data-table button.is-primary')
      .then(buttons => {
        cy.wrap(buttons[2]).click();
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

  it('should update ADRES DOMOWY', () => {
    cy
      .get('#data-table button.is-info')
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('input[name="company"]').clear().type('LUFTHANSA LTD.');
        cy.get('button[type="submit"]').click();
      });

      cy.wait(2000);

      cy
        .get('#data-table button.is-primary')
        .then(buttons => {
          cy.wrap(buttons[0]).click();
          cy.get('input[name="entryTitle"]').should('have.value', 'ADRES DOMOWY');
          cy.get('input[name="firstName"]').should('have.value', 'Dominik');
          cy.get('input[name="middleName"]').should('have.value', '');
          cy.get('input[name="lastName"]').should('have.value', 'Kreński');
          cy.get('input[name="birthday"]').should('have.value', '1984-08-05');
          cy.get('input[name="company"]').should('have.value', 'LUFTHANSA LTD.');
          cy.get('input[name="addressOne"]').should('have.value', 'ul. Urocza 11A/4');
          cy.get('input[name="addressTwo"]').should('have.value', '');
          cy.get('input[name="city"]').should('have.value', 'Juszkowo');
          cy.get('input[name="country"]').should('have.value', 'Polska');
          cy.get('input[name="state"]').should('have.value', 'pomorskie');
          cy.get('input[name="email"]').should('have.value', 'dominik.krenski@gmail.com');
          cy.get('input[name="phone"]').should('have.value', '');
          cy.get('input[name="mobilePhone"]').should('have.value', '+48 536 969 171');
          cy.get('input[name="notes"]').should('have.value', 'adres domowy');
      });
  });

  it('should update TEŚCIOWA', () => {
    cy
      .get('#data-table button.is-info')
      .then(buttons => {
        cy.wrap(buttons[2]).click();
        cy.get('input[name="entryTitle"]').clear().type('TEŚCIOWA - UPDATED');
        cy.get('input[name="middleName"]').clear().type('Ewa');
        cy.get('input[name="country"]').type('Polska');
        cy.get('input[name="city"]').type('Radzyń Chełmiński');
        cy.get('button[type="submit"]').click();

        cy.wait(2000);
        cy.get('#data-table button.is-primary');
      })
      .then(buttons => {
        cy.wrap(buttons[2]).click();
        cy.get('input[name="entryTitle"]').should('have.value', 'TEŚCIOWA - UPDATED');
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
        cy.get('input[name="notes"]').should('have.value', 'przykładowy adres teściowej');
      });
  });

  it('should delete address MAMA', () => {
    cy
      .get('#data-table button.is-danger')
      .then(buttons => {
        cy.wrap(buttons[1]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table table tbody tr');
      })
      .then(rows => {
        expect(rows).to.have.length(2);
      });
  });

  it('should delete addresses ADRES DOMOWY and TEŚCIOWA', () => {
    cy
      .get('#data-table button.is-danger')
      .then(buttons => {
        cy.wrap(buttons[2]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table table tbody tr')
      })
      .then(rows => {
        expect(rows).to.have.length(2);
        cy.get('#data-table button.is-danger')
      })
      .then(buttons => {
        cy.wrap(buttons[0]).click();
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table table tbody tr');
      })
      .then(rows => {
        expect(rows).to.have.length(1);
      });
  });


});
