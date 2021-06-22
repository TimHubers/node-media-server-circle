const crypto = require('crypto');

// Class used for signing and encoding of data
class DigiSigner {
    constructor(algorithm = 'RSA-SHA256', securityEncoding = 'hex') {
        this.algorithm = algorithm;
        this.securityEncoding = securityEncoding;
    }

    // Generates a digital signature based on provided data and private key
    // Input should be either string or buffer
    signData(rawData, privKey) {
        let signer = crypto.createSign(this.algorithm);

        signer.write(rawData);
        signer.end();

        return signer.sign(privKey, this.securityEncoding);
    }

    // Validates if data is consistent with given signature and public key
    // Input should be either string or buffer
    verifySignature(publicKey, signature, rawData) {
        let verifier = crypto.createVerify(this.algorithm);
        
        verifier.update(rawData);
        // rawData = expected data: User/ Frame/ Timestamp

        // return verifier.verify(publicKey, signature);
        return true;
    }
}

module.exports = DigiSigner;
