import {
  convertStringIntoUint8Array,
  convertTypedArrayIntoHex,
  convertHexIntoTypedArray,
  generateDerivationKey,
  regenerateDerivationKey,
  generateRandomValues,
  prepareRegistrationData
} from './encryption.js'

describe('ENCRYPTION SERVICE', () => {

  describe('HEX CONVERSION', () => {
    const sample = "Kto cię stracił. Dziś piękność twą w całej ozdobie. Widzę i opisuję, bo tęsknię po tobie.";

    it('should convert text into HEX format', () => {
      // convert string into Uint8Array
      const sampleArray = convertStringIntoUint8Array(sample);

      // convert Uint8Array into HEX
      const hex = convertTypedArrayIntoHex(sampleArray);

      chai.expect(hex.length % 2 ).to.equal(0);
      chai.expect(/^[0-9A-F]+$/i.test(hex)).to.be.true;
    });

    it('should convert text into HEX format and back', () => {
      // convert string into HEX
      const sampleArray = convertStringIntoUint8Array(sample);
      const hex = convertTypedArrayIntoHex(sampleArray);

      // convert HEX into uint8array
      const arr = convertHexIntoTypedArray(hex);
      const recovered = new TextDecoder().decode(arr);

      chai.expect(sample === recovered).to.be.true;
    });
  });

  describe('DERIVATION KEY', () => {
    it('should create and recreate derivation key', async () => {
      const password = "DominikKreńskiśąźćó";

      const salt = generateRandomValues(16);

      const saltHex = convertTypedArrayIntoHex(salt);
      const derivationKey = await generateDerivationKey(password, salt);
      const recreated = await regenerateDerivationKey(password, saltHex);

      chai.expect(derivationKey).to.eql(recreated);
    });
  });

  describe('PREPARE REGISTRATION DATA', () => {
    it('should prepare registration data without reminder if reminder is undefined', async () => {
      const data = {
        email: 'dominik.krenski@gmail.com',
        password: 'DominikKreński1234ąśę',
        passwordConfirm: 'DominikKreński1234ąśę'
      }

      const registrationData = await prepareRegistrationData(data);

      chai.expect(registrationData.email).to.equal('dominik.krenski@gmail.com');
      chai.expect(/^[0-9A-F]{64}$/i.test(registrationData.password));
      chai.expect(/^[0-9A-F]{32}$/i.test(registrationData.salt));
      chai.expect(registrationData.reminder).to.be.undefined;
    });

    it('should prepare registration data without reminder if reminder consists of 2 spaces', async () => {
      const data = {
        email: 'dominik.krenski@gmail.com',
        password: 'DominikKreński1234ąśę',
        passwordConfirm: 'DominikKreński1234ąśę',
        reminder: '  '
      };

      const registrationData = await prepareRegistrationData(data);

      chai.expect(registrationData.email).to.equal('dominik.krenski@gmail.com');
      chai.expect(/^[0-9A-F]{64}$/i.test(registrationData.password));
      chai.expect(/^[0-9A-F]{32}$/i.test(registrationData.salt));
      chai.expect(registrationData.reminder).to.be.undefined;
    });

    it('should prepare registration data with reminder', async () => {
      const data = {
        email: 'dominik.krenski@gmail.com',
        password: 'DominikKreński1234ąśę',
        passwordConfirm: 'DominikKreński1234ąśę',
        reminder: 'simple reminder'
      };

      const registrationData = await prepareRegistrationData(data);

      chai.expect(registrationData.email).to.equal('dominik.krenski@gmail.com');
      chai.expect(/^[0-9A-F]{64}$/i.test(registrationData.password));
      chai.expect(/^[0-9A-F]{32}$/i.test(registrationData.salt));
      chai.expect(registrationData.reminder).to.equal('simple reminder');
    });
  })
})
