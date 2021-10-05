const expect = require('chai').expect;
const {
  requiredValidator,
  minLengthValidator,
  maxLengthValidator,
  emailValidator,
  atLeastOneDigitValidator
} = require('../src/app/utils/validators');

describe('VALIDATORS TEST', () => {
  describe('REQUIRED VALIDATOR', () => {
    it('validator should pass if value is "dominik"', () => {
      expect(requiredValidator('dominik')).to.be.null;
    });

    it('validator should pass if value is "a "', () => {
      expect(requiredValidator('a ')).to.be.null;
    })

    it('validator should fail if value consists of one space', () => {
      expect(requiredValidator(' ')).to.be.equal('Field is required');
    });

    it('validator should fail if value consists of three spaces', () => {
      expect(requiredValidator('   ')).to.be.equal('Field is required');
    })

    it('validator should fail if value is an empty string', () => {
      expect(requiredValidator('')).to.be.equal('Field is required');
    });

    it('validator should fail if value is null', () => {
      expect(requiredValidator(null)).to.be.equal('Field is required');
    });

    it('validator should fail if value is undefined', () => {
      expect(requiredValidator(undefined)).to.be.equal('Field is required');
    });
  });

  describe('MINLENGTH VALIDATOR', () => {
    it('validator should pass if minlength is 12 and value is Dominik1984!', () => {
      expect(minLengthValidator('Dominik1984!', 12)).to.be.null;
    });

    it('validator should fail if minlength is 10 and value is " Dominik  "', () => {
      expect(minLengthValidator(' Dominik  ', 10)).to.equal(10);
    });

    it('validator should fails if value is null', () => {
      expect(minLengthValidator(null, 5)).to.equal(5);
    });

    it('validator should fail if value is undefined', () => {
      expect(minLengthValidator(undefined, 1)).to.equal(1);
    });

    it('validator should fail if value consists of 2 spaces', () => {
      expect(minLengthValidator('  ', 2)).to.equal(2);
    });
  });

  describe('MAXLENGTH VALIDATOR', () => {
    it('validator should pass if value is unefined', () => {
      expect(maxLengthValidator(undefined, 10)).to.be.null;
    });

    it('validator should pass if value is null', () => {
      expect(maxLengthValidator(null, 10)).to.be.null;
    });

    it('validator should pass if value is an empty string', () => {
      expect(maxLengthValidator('', 3)).to.be.null;
    });

    it('validator should pass if value consists of 4 spaces and max length is 2', () => {
      expect(maxLengthValidator('    ', 2)).to.be.null;
    })

    it('validator should pass if value is "   dominik"', () => {
      expect(maxLengthValidator('   dominik', 7)).to.be.null;
    });

    it('validator should pass if value is "dom  "', () => {
      expect(maxLengthValidator('dom  ', 3)).to.be.null;
    });

    it('validator should fail if value is "dom" and max length is 2', () => {
      expect(maxLengthValidator('dom', 2)).to.equal(2);
    });

    it('validator should fail if value is "dom " and max length is 2', () => {
      expect(maxLengthValidator('dom ', 2)).to.equal(2);
    });
  });

  describe('EMAIL VALIDATOR', () => {
    it('validator should pass if email is "dominik.krenski@gmail.com"', () => {
      expect(emailValidator('dominik.krenski@gmail.com')).to.be.null;
    });

    it('validator should pass if email is "pass.dominik-krenski@ovh"', () => {
      expect(emailValidator('pass.dominik-krenski@ovh')).to.be.null;
    });

    it('validator should fail if email is null', () => {
      expect(emailValidator(null)).to.equal('Email is not valid');
    });

    it('validator should fail if email is undefined', () => {
      expect(emailValidator(undefined)).to.equal('Email is not valid');
    });

    it('validator should pass if email is "dominik@gmail"', () => {
      expect(emailValidator('dominik@gmail')).to.be.null;
    });

    it('validator should fail if email is "dominik.yahoo"', () => {
      expect(emailValidator('dominik.yahoo')).to.equal('Email is not valid');
    });
  });

  describe('AT_LEAST_ONE_DIGIT VALIDATOR', () => {
    const message = 'Field must contain at least one digit';

    it('validator should pass if value is "a3"', () => {
      expect(atLeastOneDigitValidator('a3')).to.be.null;
    });

    it('validator should pass if value is "akhfja4dsf"', () => {
      expect(atLeastOneDigitValidator('akhfja4dsf')).to.be.null;
    });

    it('validator should pass if value is " 4  a"', () => {
      expect(atLeastOneDigitValidator(' 4 a')).to.be.null;
    });

    it('validator should fail if value is an empty string', () => {
      expect(atLeastOneDigitValidator('')).to.equal(message);
    });

    it('validator should fail if value consists of space', () => {
      expect(atLeastOneDigitValidator(' ')).to.equal(message);
    });

    it('validator should fail if value is undefined', () => {
      expect(atLeastOneDigitValidator(undefined)).to.equal(message);
    });

    it('validator should fail if value is null', () => {
      expect(atLeastOneDigitValidator(null)).to.equal(message);
    });
  })
})
