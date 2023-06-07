const BlowfishTranslation = require('./blowfishTranslation.js').default
const MACGeneration = require('./hmacGeneration.js').default
const ParseResponse = require('./keyValueParser.js')

// Example of how to create blowfish string
blowfish = new BlowfishTranslation('YOUR UNENCRYPTED STRING');
console.log(blowfish.encryptBlowfish());

// Example of how to unencrypt blowfish string
blowfish.string = 'YOUR ENCRYPTED STRING';
console.log(blowfish.decryptBlowfish());

// Example of how to generate MAC hash
mac = new MACGeneration('STRING FOR HASH GENERATION');
console.log(mac.generateMAC());

// Example of how to parse a key-value string
res = new ParseResponse('mid=myMerchantID&TransID=12345678&Code=00000000&description=Success');
console.log(res.parse());