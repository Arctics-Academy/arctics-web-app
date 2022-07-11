// Utils
const { fileToString } = require('../../../utils/file.utils');

// Main Functions
const ConsultantNotification = {
    "ColumnName": ["title", "description"],
    "Welcome": [fileToString('statics/notifs/texts/Consultant-Welcome.txt'), null],
    "StudentCardVerified": [fileToString('statics/notifs/texts/Consultant-StudentCardVerified.txt'), null]
};

console.log(ConsultantNotification);


// Exports
module.exports = { ConsultantNotification };