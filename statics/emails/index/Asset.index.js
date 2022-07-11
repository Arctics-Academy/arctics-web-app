// Utils
const { fileToBase64String } = require('../../../utils/file.utils');


// Main Functions
const Asset = {
    "ColumnName": "attachment object",
    "EmailLogo": {
        filename: "logo.png",
        encoding: "base64",
        contentType: "image/png",
        content: fileToBase64String('statics/emails/imgs/logo.png'),
        cid: "<logo.png@arctics.academy>"
    }
};


// Exports
module.exports = { Asset };