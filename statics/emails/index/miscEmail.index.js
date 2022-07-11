// Modules
const { compileFile } = require('pug');

// Utils
const { fileToString } = require('../../../utils/file.utils');


// Main Functions
const MiscEmail = {
    "ColumnName": ["title", "text", "html"],
    "Otp": ["`[Arctics升學顧問] 電子郵件驗證碼 (${code})`", fileToString('statics/emails/texts/SYS-OtpEmail.txt'), compileFile('statics/emails/pugs/SYS-OtpEmail.pug')],
    "StudentCardVerified": ["`[Arctics升學顧問] 身份驗證成功✅`", fileToString('statics/emails/texts/SYS-StudentCardEmail-Consultant.txt'), compileFile('statics/emails/pugs/SYS-StudentCardEmail-Consultant.pug')],
    "ConsultantWelcome": ["`[Arctics升學顧問] 註冊成功🎉`", fileToString('statics/emails/texts/SYS-Welcome-Consultant.txt'), compileFile('statics/emails/pugs/SYS-Welcome-Consultant.pug')]
};


// Exports
module.exports = { MiscEmail }