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

var data = [{ id: 1 }, { id: 2 }]

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData); // [{id: 1}, {id: 2}]

// Text encoder

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromBase64 = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function deriveKey(pin, salt) {
  const pinKey = await crypto.subtle.importKey(
    "raw", encoder.encode(pin), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" },
    pinKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(key, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, encoder.encode(JSON.stringify(data))
  );
  return { iv: toBase64(iv), data: toBase64(encrypted) };
}

async function decryptData(key, stored) {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(stored.iv) }, key, fromBase64(stored.data)
  );
  return JSON.parse(decoder.decode(plain));
}