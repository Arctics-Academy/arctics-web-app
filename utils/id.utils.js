var cryptojs = require('crypto-js');

function genUserID(count, pre) {
    let id = '';

    let len = count.toString().length;
    if (len < 8) {
        let zeros = 8 - len;
        while (zeros !== 0) {
            id += '0';
            zeros--;
        }
        id += (++count).toString();
    } else {
        id = (++count).toString();
    }
    
    id = pre + id;
    return id;
}

function genMeetingID(count) {
    let id = '';

    let len = count.toString().length;
    if (len < 5) {
        let zeros = 5 - len;
        while (zeros !== 0) {
            id += '0';
            zeros--;
        }
        id += (++count).toString();
    } else {
        id = (++count).toString();
    }
    
    id = '#' + id;
    return id;
}

function genMobileOTP() {
    let length = 6;
    let numString = Math.floor(Math.random() * (10**length)).toString();
    numString = _toNthLengthString(numString, length);
    return numString;
}

function genEmailOTP() {
    let charLength = 4;
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charString = '';
    while (charLength !== 0) {
        let position = Math.floor(Math.random() * 100) % 26;
        charString += charSet[position];
        charLength--;
    }

    let numLength = 4;
    let numString = Math.floor(Math.random() * (10**numLength)).toString();
    numString = _toNthLengthString(numString, numLength);

    return charString + numString;
}

function encryptId(id) {
    return cryptojs.AES.encrypt(id, 'arctics.academy').toString();
}

function decryptId(encrypted) {
    var bytes = cryptojs.AES.decrypt(encrypted, 'arctics.academy');
    return bytes.toString(cryptojs.enc.Utf8);
}

function _toNthLengthString(string, n) {
    if (string.length >= n) return string;
    else {
        let zeros = n - string.length;
        let altered = new String(string)
        while (zeros !== 0) {
            altered = '0' + altered;
            zeros--;
        }
        return altered;
    }
}


module.exports = {
    genUserID,
    genMeetingID,
    
    genMobileOTP,
    genEmailOTP,

    encryptId,
    decryptId
}