// Modules
const { compileFile } = require('pug');

// Utils
const { fileToString } = require('../../../utils/file.utils');


// Main Functions
const BookingEmail = {
    "ColumnName": ["title", "text", "html"],
    "S0-S0-Book-Consultant": ["`[Arctics Academy升大學顧問平台] 學生預約諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S0-Book-Consultant.txt'), compileFile('statics/emails/pugs/S0-S0-Book-Consultant.pug')],

    "S0-S0-Book-Student": ["`[Arctics Academy升大學顧問平台] 諮詢預約成功通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S0-Book-Student.txt'), compileFile('statics/emails/pugs/S0-S0-Book-Student.pug')],

    "S0-S1-Cancel-Consultant": ["`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S1-Cancel-Consultant.txt'), compileFile('statics/emails/pugs/S0-S1-Cancel-Consultant.pug')],

    "S0-S1-Cancel-Student": ["`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S1-Cancel-Student.txt'), compileFile('statics/emails/pugs/S0-S1-Cancel-Student.pug')],

    "S0-S2-Cancel-Consultant": ["`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S2-Cancel-Consultant.txt'), compileFile('statics/emails/pugs/S0-S2-Cancel-Consultant.pug')], 

    "S0-S2-Cancel-Student": ["`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S2-Cancel-Student.txt'), compileFile('statics/emails/pugs/S0-S2-Cancel-Student.pug')],

    "S0-S2-Pay-Student": ["`[Arctics Academy升大學顧問平台] 付款成功通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S2-Pay-Student.txt'), compileFile('statics/emails/pugs/S0-S2-Pay-Student.pug')],

    "S0-S3-Cancel-Consultant": ["`[Arctics Academy升大學顧問平台] 系統取消諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S3-Cancel-Consultant.txt'), compileFile('statics/emails/pugs/S0-S3-Cancel-Consultant.pug')],

    "S0-S3-Cancel-Student": ["`[Arctics Academy升大學顧問平台] 系統取消諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S3-Cancel-Student.txt'), compileFile('statics/emails/pugs/S0-S3-Cancel-Student.pug')],

    "S0-S4-Cancel-Consultant": ["`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S4-Cancel-Consultant.txt'), compileFile('statics/emails/pugs/S0-S4-Cancel-Consultant.pug')],

    "S0-S4-Cancel-Student": ["`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`", fileToString('statics/emails/texts/S0-S4-Cancel-Student.txt'), compileFile('statics/emails/pugs/S0-S4-Cancel-Student.pug')]
};


// Exports
module.exports = { BookingEmail };