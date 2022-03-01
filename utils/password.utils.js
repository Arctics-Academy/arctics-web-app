var bcrypt = require('bcrypt')

function getHashedPassword(original) {
    let salt = bcrypt.genSaltSync(10);
    let hashed = bcrypt.hashSync(original, salt);
    return [hashed, salt];
}

function matchHashPassword(original, salt) {
    let hashed = bcrypt.hashSync(original, salt);
    return hashed;
}


function validatePassword(password) {
    try {
        _lengthTest(password);
        _lowercaseTest(password);
        _uppercaseTest(password);
        _numberTest(password);
        _charTest(password);
    } catch(err) {
        console.log(err);
        return false;
    }
    return true;
}


function _lengthTest(password) {
    if (password.length < 8) {
        throw new Error('InputError: input password is LESS than 8 characters');
    } else if (password.length > 150) {
        throw new Error('InputError: input password is MORE than 150 characters');
    } else {
        return;
    }
}

function _lowercaseTest(password) {
    if (password.toUpperCase() === password) {
        throw new Error('InputError: input password does not have LOWERCASE characters');
    } else {
        return;
    }
}

function _uppercaseTest(password) {
    if (password.toLowerCase() === password) {
        throw new Error('InputError: input password does not have UPPERCASE characters');
    } else {
        return;
    }
}

function _numberTest(password) {
    let numRegex = /\d/g;
    if (!numRegex.test(password)) {
        throw new Error('InputError: input password does not contain a NUMBER');
    }
    return;
}

function _charTest(password) {
    let specialRegex = /[ !"#$%&'()*+,-./:;<=>?@\[\]\\^_{|}~`]/g
    if (!specialRegex.test(password)) {
        throw new Error('InputError: input password does not contain a SPECIAL CHARACTER');
    }
    return;
}


module.exports = {
    getHashedPassword,
    matchHashPassword,
    validatePassword
}