import { expect } from "chai";

describe('REGISTRATION FORM VALIDATION', () => {
  it('should display all errors if registration button was clicked without filling in any field', () => {
    cy.visit('/signup');
    //cy.get('#password-requirements').as('requirements');

    // password-requirements should not be visible
    cy.get('#password-requirements').should('not.exist');

    cy.get('button').click();

    // get email validation errors
    cy.get('ul')
      .then(lists => {
        cy.wrap(lists[0]).children();
      })
      .then(rows => {
        cy.wrap(rows[0]).should('have.text', 'Field is required')
        cy.wrap(rows[1]).should('have.text', 'Email is not valid');
      });

    // get password validation errors
    cy
      .get('ul')
      .then(lists => {
        cy.wrap(lists[1]).children();
      })
      .then(rows => {
        cy.wrap(rows[0]).children('span').should('have.class', 'error');
        cy.wrap(rows[1]).children('span').should('have.class', 'error');
        cy.wrap(rows[2]).children('span').should('have.class', 'error');
        cy.wrap(rows[3]).children('span').should('have.class', 'error');
        cy.wrap(rows[4]).children('span').should('have.class', 'success');
      });

    // get passwordConfirm validation errors
    cy
      .get('ul')
      .then(lists => {
        cy.wrap(lists[2]).children();
      })
      .then(rows => {
        cy.wrap(rows[0]).should('have.text', 'Field is required');
      })
  });
})
