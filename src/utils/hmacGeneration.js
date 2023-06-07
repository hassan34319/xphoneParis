const dotenv = require('dotenv').config();

class MACGeneration {

    constructor(string) {
        this.text = string;
    }

    generateMAC() {
        // Our key
        const key = process.env.NEXT_PUBLIC_KEY_HMAC
        // Using node's crypto to generate and return hash
        const hash = require("crypto")
            .createHmac('sha256', key)
            .update(this.text)
            .digest('hex');
        return hash.toUpperCase();
    }
}

export default MACGeneration;