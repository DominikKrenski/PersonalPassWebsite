const expect = require('chai').expect;
const { requiredValidator } = require('../src/app/utils/validators');

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


  })
})
