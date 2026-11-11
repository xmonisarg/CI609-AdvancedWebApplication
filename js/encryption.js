// Encryption script for user PINs, using the CryptoJS library

let sessionKey = null; // kept in memory only

function deriveKey(pin, saltHex) {
    return CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(saltHex), {
        keySize: 256 / 32,
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
    });
}

function encryptData(key, data) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv: iv });
    return { iv: iv.toString(), data: encrypted.toString() };
}

function decryptData(key, stored) {
    const bytes = CryptoJS.AES.decrypt(stored.data, key, {
        iv: CryptoJS.enc.Hex.parse(stored.iv)
    });
    const text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) throw new Error("Could not decrypt");
    return JSON.parse(text);
}

function setPin(pin) {
    const saltHex = CryptoJS.lib.WordArray.random(16).toString();
    const key = deriveKey(pin, saltHex);
    localStorage.setItem("salt", saltHex);
    localStorage.setItem("pinHash", CryptoJS.SHA256(key.toString()).toString());
    sessionKey = key;
}

function unlock(pin) {
    const key = deriveKey(pin, localStorage.getItem("salt"));
    if (CryptoJS.SHA256(key.toString()).toString() !== localStorage.getItem("pinHash")) {
        return false; // wrong PIN
    }
    sessionKey = key;
    return true;
}

function saveEntry(entry) {
    const stored = JSON.parse(localStorage.getItem("entries") || "[]");
    stored.push(encryptData(sessionKey, entry));
    localStorage.setItem("entries", JSON.stringify(stored));
}

function loadEntries() {
    const stored = JSON.parse(localStorage.getItem("entries") || "[]");
    return stored.map(e => decryptData(sessionKey, e));
}