const Pug = require('pug');
const { fileToString } = require('../../../utils/file.utils');

const OtpCompiledEmail = Pug.compileFile('statics/emails/pugs/SYS-OtpEmail.pug')
const OtpTemplateString = fileToString('statics/emails/texts/SYS-OtpEmail.txt')

const StudentCardVerifiedEmail = Pug.compileFile('statics/emails/pugs/SYS-StudentCardEmail-Consultant.pug');
const StudentCardVerifiedTemplateString = fileToString('statics/emails/texts/SYS-StudentCardEmail-Consultant.txt');

module.exports = 
{
    OtpCompiledEmail,
    OtpTemplateString,
    
    StudentCardVerifiedEmail,
    StudentCardVerifiedTemplateString,
}