import './HomeInfo.local.scss';

const HomeInfo = () => {
  return (
    <section id="home-info" className="columns is-multiline">
      <div className="column is-two-fifhts">
        <div className="info-title">
          <p>Strong algorithms</p>
        </div>
        <div className="info-text">
          <p>
            Personal Pass implements AES-256 bit encryption with PBKDF2 SHA-256 and salted hashes to ensure
            complete security in the web. You'll create a password mmanager account with an email address and a strong master
            password to locally generate a unique encryption key.
          </p>
        </div>
      </div>

      <div className="column is-two-fifths is-offset-one-fifth">
        <div className="info-title">
          <p>Local-only encryption</p>
        </div>
        <div className="info-text">
          <p>
            Your data is encrypted and decrypted at the device level. Data stored on our servers is kept secret, even from Personal Pass.
            Your master password, and the keys used to encrypt and decrypt data, are never sent to our servers.
          </p>
        </div>
      </div>

      <div className="column is-two-fifths">
        <div className="info-title">
          <p>Open Source</p>
        </div>
        <div className="info-text">
          <p>
            Personal pass is an open source project so anyone can verify the code that protects your data.
          </p>
        </div>
      </div>

      <div className="column is-two-fifhts is-offset-one-fifth">
        <div className="info-title">
          <p>On Any Device</p>
        </div>
        <div className="info-text">
          <p>
            Our dedicated applications for Android and desktops ley you store data everywhere.
            Our fast web client apps make sure data encryption is a pleasant experience.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HomeInfo;
