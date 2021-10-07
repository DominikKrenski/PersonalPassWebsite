import { expect } from "chai";

describe('REGISTRATION FORM VALIDATION', () => {

  beforeEach(() => {
    cy.visit('/signup');
  });

  describe('EMAIL FIELD', () => {
    it('should display all errors if form was submitted without filling in any field', () => {
      cy.get('#password-requirements').should('not.exist');
      cy.get('button').click();

      // email validation errors
      cy
        .get('#email-field li')
        .then(rows => {
          cy.wrap(rows[0]).should('have.text', 'Field is required');
          cy.wrap(rows[1]).should('have.text', 'Email is not valid');
        });

      // password validation errors
      cy
        .get('#password-requirements li span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'error');
          cy.wrap(spans[2]).should('have.class', 'error');
          cy.wrap(spans[3]).should('have.class', 'error');
          cy.wrap(spans[4]).should('have.class', 'success');
        });

      cy.get('#password-confirm-field li').should('have.text', 'Field is required');
    });

    it('should display required error if email is not touched', () => {
      cy.get('button').click();
      cy
        .get('#email-field li')
        .then(rows => {
          cy.wrap(rows[0]).should('have.text', 'Field is required');
          cy.wrap(rows[1]).should('have.text', 'Email is not valid');
        });
    });

    it('should display errors if email is filling with two spaces', () => {
      cy.get('input[name="email"]').type('  ');
      cy.get('button').click();
      cy
        .get('#email-field li')
        .then(rows => {
          cy.wrap(rows[0]).should('have.text', 'Field is required');
          cy.wrap(rows[1]).should('have.text', 'Email is not valid');
        });
    });

    it('should display errors if email is initially filled in and cleared', () => {
      cy.get('input[name="email"]').type('dominik.krenski@gmail.com').clear();
      cy.get('button').click();
      cy
        .get('#email-field li')
        .then(rows => {
          cy.wrap(rows[0]).should('have.text', 'Field is required');
          cy.wrap(rows[1]).should('have.text', 'Email is not valid');
        });
    });

    it('should not display error messages if email is " dominik.krenski@gmail.com  "', () => {
      cy.get('input[name="email"]').type(' dominik.krenski@gmail.com  ');
      cy.get('button').click();
      cy.get('#email-field li').should('not.exist');
    });

    it('should display error message if email is dominik.yahoo', () => {
      cy.get('input[name="email"]').type('dominik.yahoo');
      cy.get('button').click();
      cy.get('#email-field li').should('have.text', 'Email is not valid');
    });

    it('should not display error message if email is dominik@gmail', () => {
      cy.get('input[name="email"]').type('dominik@gmail');
      cy.get('button').click();
      cy.get('#email-field li').should('not.exist');
    });
  })

  describe('PASSWORD FIELD', () => {
    it('only email validator should pass', () => {
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'error');
          cy.wrap(spans[2]).should('have.class', 'error');
          cy.wrap(spans[3]).should('have.class', 'error');
          cy.wrap(spans[4]).should('have.class', 'success');
        })
    });

    it('proper icons should be set if password is "dominik"', () => {
      cy.get('input[name="password"]').type('dominik');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'error');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'error');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('should display proper icons if password is "Dominik"', () => {
      cy.get('input[name="password"]').type('Dominik');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'error');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('should display proper icons if password is "Dominik1"', () => {
      cy.get('input[name="password"]').type('Dominik1');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'success');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('should display proper icons if password is "Dominik1984!"', () => {
      cy.get('input[name="password"]').type('Dominik1984!');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'success');
          cy.wrap(spans[1]).should('have.class', 'success');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('should display proper icons if password is " Dominik1984"', () => {
      cy.get('input[name="password"]').type(' Dominik1984');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'success');
          cy.wrap(spans[1]).should('have.class', 'success');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('should display proper icons if email is "Dominik1984!" first and then "ominik"', () => {
      cy.get('input[name="password"]').as('pass');
      cy.get('button').as('btn');

      cy.get('@pass').type('Dominik1984!');
      cy.get('@btn').click();

      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'success');
          cy.wrap(spans[1]).should('have.class', 'success');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });

      cy.get('@pass').clear().type('ominik');
      cy.get('@btn').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'error');
          cy.wrap(spans[1]).should('have.class', 'error');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'error');
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('email should not be validated if field is not filled in', () => {
      cy.get('input[name="password"]').type('Dominik1984!');
      cy.get('button').click();
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[4]).should('have.class', 'success');
        });
    });

    it('email should not be validated if is invalid', () => {
      cy.get('input[name="email"]').type('dom.gmail');
      cy.get('input[name="password"]').type('Dominik1984!');
      cy.get('button').click();

      cy
        .get('#password-requirements span')
        .then(span => {
          cy.wrap(span[4]).should('have.class', 'success');
        });
    });

    it('email should be invalid if email is "dominik.krenski@gmail.com" and password is "DOMINik.kreNSKI"', () => {
      cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
      cy.get('input[name="password"]').type('DOMINik.kreNSKI');
      cy.get('button').click();

      cy
        .get('#password-requirements span')
        .then(span => {
          cy.wrap(span[4]).should('have.class', 'error');
        });
    });

    it('email validator should pass if email is "dominik.krenski@gmail.com and password is Dominik1984!"', () => {
      cy.get('input[name="email"]').type('dominik.krenski@gmail.com');
      cy.get('input[name="password"]').type('Dominik1984!');
      cy.get('button').click();

      cy
        .get('#password-requirements span')
        .then(span => {
          cy.wrap(span[4]).should('have.class', 'success');
        });
    });
  });

  describe('PASSWORD_CONFIRM FIELD', () => {
    it('should display required error if field is empty', () => {
      cy.get('button').click();
      cy
        .get('#password-confirm-field li')
        .then(li => {
          cy.wrap(li).should('have.text', 'Field is required')
        });
    });

    it('should display not equal error if fields differ with case only', () => {
      cy.get('input[name="password"]').type('Dominik');
      cy.get('input[name="passwordConfirm"]').type('dominik');
      cy.get('button').click();

      cy
        .get('#password-confirm-field li')
        .then(li => {
          cy.wrap(li).should('have.text', 'Fields are not equal');
        })
    });

    it('fields should be equal if confirmation is empty', () => {
      cy.get('input[name="password"]').type('Dominik1984!');
      cy.get('button').click();

      cy
        .get('#password-confirm-field li')
        .should('have.text', 'Field is required');
    });

    it('fields should be equal if password is empty and passwordConfirm filled in', () => {
      cy.get('input[name="passwordConfirm"]').type('Dominik1984!');
      cy.get('button').click();

      cy.get('#password-confirm-field ul').should('not.exist');
    });
  });

  describe('WHOLE FORM IS VALID', () => {
    it('form should be valid if all fields are valid', () => {
      cy.get('input[name="email"]').type('dorciad@interia.pl');
      cy.get('input[name="password"]').type('Guzik1302@!#$');
      cy.get('input[name="passwordConfirm"]').type('Guzik1302@!#$');
      cy.get('input[name="reminder"]').type('simple reminder');
      cy.get('button').click();

      // check email
      cy.get('#email-field ul').should('not.exist');

      // check password
      cy
        .get('#password-requirements span')
        .then(spans => {
          cy.wrap(spans[0]).should('have.class', 'success');
          cy.wrap(spans[1]).should('have.class', 'success');
          cy.wrap(spans[2]).should('have.class', 'success');
          cy.wrap(spans[3]).should('have.class', 'success');
          cy.wrap(spans[4]).should('have.class', 'success');
        });

      // check password confirmation
      cy.get('#password-confirm-field ul').should('not.exist');

      // check reminder
      cy.get('#reminder-field ul').should('not.exist');
    });
  });
});
