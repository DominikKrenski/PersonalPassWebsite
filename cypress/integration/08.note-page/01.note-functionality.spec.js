const { expect } = require('chai');

describe('NOTE FUNCTIONALITY', () => {
  beforeEach(() => {
    cy.exec('PGPASSWORD=Dominik1984 psql -Udominik -dpersonal_pass --file ./cypress_database.sql');
    cy.visit('/signin');
    cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
    cy.get('input[name="password"]').type('Dominik1984!');
    cy.get('button[type="submit"]').click();

    cy
      .get('#secure-nav ul a')
      .then(anchors => {
        cy.wrap(anchors[4]).click({force: true});
      });
  });

  it('should display two notes', () => {
    cy
      .get('#data-table tbody tr td:nth-child(2)')
      .then(tds => {
        expect(tds).to.have.length(2);
        cy.wrap(tds[0]).should('contain.text', 'Dante Alighieri - Boska komedia');
        cy.wrap(tds[1]).should('contain.text', 'NOTATKA 1')
      });
  });

  it('should display two error messages if title and note are not set', () => {
    cy.get('#add-note-icon').click({force: true});
    cy.get('button[type="submit"]').click({force: true});
    cy
      .get('.validation-message')
      .each(msg => {
        cy.wrap(msg).should('have.text', 'Pole jest wymagane')
      })
  });

  it('should display one error message if title is not set', () => {
    cy.get('#add-note-icon').click({force: true});
    cy.get('textarea[name="message"]').type('stupid message');
    cy.get('button[type="submit"]').click({force: true});
    cy.get('.validation-message').should('have.text', 'Pole jest wymagane');
  });

  it('should display one error message if message is not set', () => {
    cy.get('#add-note-icon').click({force: true});
    cy.get('input[name="entryTitle"]').type('DUMMY');
    cy.get('button[type="submit"]').click({force: true});
    cy.get('.validation-message').should('have.text', 'Pole jest wymagane');
  });

  it('should create new note', () => {
    cy.get('#add-note-icon').click({force: true});
    cy.get('input[name="entryTitle"]').type('DUMMY');
    cy.get('textarea[name="message"]').type('dummy message');
    cy.get('button[type="submit"]').click({force: true});

    cy.wait(2000);

    cy
      .get('#data-table table tbody tr')
      .then(rows => {
        expect(rows).to.have.length(3);
      });
  });

  it('should display Dante Alighieri - Boska komedia', () => {
    const msg = "Prze­ze mnie dro­ga w mia­sto utra­pie­nia,\n" +
    "Prze­ze mnie dro­ga w wie­ku­iste męki,\n" +
    "Prze­ze mnie dro­ga w na­ród za­tra­ce­nia.\n" +
    "Jam dzie­ło wiel­kiej, spra­wie­dli­wej ręki.\n" +
    "Wznio­sła mię z grun­tu Po­tę­ga wszech­włod­na,\n" +
    "Mą­drość naj­wyż­sza, Mi­łość pier­wo­rod­na;\n" +
    "Star­sze ode mnie two­ry nie ist­nie­ją,\n" +
    "Chy­ba wie­czy­ste — a jam nie­po­ży­ta!\n" +
    "Ty, któ­ry wcho­dzisz, że­gnaj się z na­dzie­ją...";

    cy
      .get('#data-table button.is-primary')
      .then(buttons => {
        cy.wrap(buttons[0]).click({force: true});
        cy.get('input[name="entryTitle"]').should('have.value', 'Dante Alighieri - Boska komedia');
        cy.get('textarea[name="message"]').should('have.value', msg);
      });
  });

  it('should display NOTATKA 1', () => {
    cy
      .get('#data-table button.is-primary')
      .then(buttons => {
        cy.wrap(buttons[1]).click({force: true});
        cy.get('input[name="entryTitle"]').should('have.value', 'NOTATKA 1');
        cy.get('textarea[name="message"]').should('have.value', 'Zwykła testowa notatka.');
      });
  });

  it('should update Dante Alighieri - Boska komedia', () => {
    cy
      .get('#data-table button.is-info')
      .then(buttons => {
        cy.wrap(buttons[0]).click({force: true});
        cy.get('input[name="entryTitle"]').clear().type('Dante Alighieri');
        cy.get('textarea[name="message"]').clear().type('Updated text');
        cy.get('button[type="submit"]').click({force: true});

        cy.wait(2000);

        cy
          .get('#data-table button.is-primary')
          .then(buttons => {
            cy.wrap(buttons[0]).click({force: true});
            cy.get('input[name="entryTitle"]').should('have.value', 'Dante Alighieri');
            cy.get('textarea[name="message"]').should('have.value', 'Updated text');
          });
      });
  });

  it('should update NOTATKA 1', () => {
    cy
      .get('#data-table button.is-info')
      .then(buttons => {
        cy.wrap(buttons[1]).click({force: true});
        cy.get('input[name="entryTitle"]').clear().type('a. Notatka');
        cy.get('textarea[name="message"]').clear().type('New message.');
        cy.get('button[type="submit"]').click({force: true});

        cy.wait(2000);

        cy
          .get('#data-table button.is-primary')
          .then(buttons => {
            cy.wrap(buttons[0]).click({force: true});
            cy.get('input[name="entryTitle"]').should('have.value', 'a. Notatka');
            cy.get('textarea[name="message"]').should('have.value', "New message.");
          });
      });
  });

  it('should delete NOTATKA 1', () => {
    cy
      .get('#data-table button.is-danger')
      .then(buttons => {
        cy.wrap(buttons[1]).click({force: true});
        cy.get('#confirmation-footer button.is-danger').click();
        cy.wait(2000);
        cy.get('#data-table table tbody tr')
      })
      .then(rows => {
        expect(rows).to.have.length(1)
      });
  });

  it('should delete all notes', () => {
    cy
      .get('#data-table button.is-danger')
      .then(buttons => {
        cy.wrap(buttons[1]).click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});
        cy.wait(2000);
        cy.get('#data-table button.is-danger').click({force: true});
        cy.get('#confirmation-footer button.is-danger').click({force: true});
        cy.wait(2000);
        cy.get('#data-table').should('not.exist');
      });
  });
});
