Version: 1.0.0 (December 2021)
Author: Tobias Kloy

This package is intended to help you integrate Gateway more easily into your Node.js application. 
For this purpose it contains classes for encryption and decryption, for generating a SHA-256 MAC hash and for converting a key-value pair string into a JSON object.

Instructions:
1) run "npm install" to install all dependencies
2) Create a file named ".env" and store your Merchant Credentials like this:
KEY_BLOWFISH=<BF Key goes here>
KEY_HMAC=<MAC key goes here>
3) In app.js you will find examples to get started. 
