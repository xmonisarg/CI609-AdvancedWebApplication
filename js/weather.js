// Fetches Weather via coordinates

fetch('weather.php?lat=51.5074&lon=-0.1278')
    .then(response => response.json())
    .then(data => {
        const info = document.getElementById('weather-info');
        if (data.error) {
            info.textContent = data.error;
        } else {
            info.textContent = data.summary;
        }
    })
    .catch(() => {
        document.getElementById('weather-info').textContent = 'Could not load weather.';
    });

// CryptonJS for encryption using AES encryption    

var CryptoJS = require("crypto-js");

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'

var CryptoJS = require("crypto-js");

var data = [{id: 1}, {id: 2}]

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData); // [{id: 1}, {id: 2}]

