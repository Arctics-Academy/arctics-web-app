// Setup External Modules
const fs = require('fs');

// Main Functions
// returns base 64 string of path
let fileToBase64String = (path) => {
    return fs.readFileSync(path, {encoding: 'base64'});
}

// returns string of txt file of path
let fileToString = (path) => {
    return fs.readFileSync(path).toString('utf-8');
}

// returns last dash delimitated string
const getEmailAddressee = (identifier) => {
    return identifier.split("-").pop();
}


module.exports = 
{ 
    fileToBase64String, 
    fileToString, 
    getEmailAddressee,
}