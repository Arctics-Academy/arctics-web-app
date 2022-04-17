const Pug = require('pug');
const { read_file_to_string } = require('../../../utils/file.utils');

const OtpCompiledEmail = Pug.compileFile('statics/emails/pugs/SYS-OtpEmail.pug')
const OtpTemplateString = read_file_to_string('statics/emails/texts/SYS-OtpEmail.txt')

const StudentCardVerifiedEmail = Pug.compileFile('statics/emails/pugs/SYS-StudentCardEmail-Consultant.pug');
const StudentCardVerifiedTemplateString = read_file_to_string('statics/emails/texts/SYS-StudentCardEmail-Consultant.txt');

module.exports = 
{
    OtpCompiledEmail,
    OtpTemplateString,
    
    StudentCardVerifiedEmail,
    StudentCardVerifiedTemplateString,
}