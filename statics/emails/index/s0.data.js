const Pug = require('pug');
const { fileToString } = require('../../../utils/file.utils');


var mapS0Subject = new Map()
mapS0Subject.set("S0-S0-Book-Consultant", "`[Arctics Academy升大學顧問平台] 學生預約諮詢通知 (${meetingId})`")
mapS0Subject.set("S0-S0-Book-Student", "`[Arctics Academy升大學顧問平台] 諮詢預約成功通知 (${meetingId})`")
mapS0Subject.set("S0-S1-Cancel-Consultant", "`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`")
mapS0Subject.set("S0-S1-Cancel-Student", "`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`")
mapS0Subject.set("S0-S2-Cancel-Consultant", "`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`") 
mapS0Subject.set("S0-S2-Cancel-Student", "`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`")
mapS0Subject.set("S0-S2-Pay-Student", "`[Arctics Academy升大學顧問平台] 付款成功通知 (${meetingId})`")
mapS0Subject.set("S0-S3-Cancel-Consultant", "`[Arctics Academy升大學顧問平台] 系統取消諮詢通知 (${meetingId})`")
mapS0Subject.set("S0-S3-Cancel-Student", "`[Arctics Academy升大學顧問平台] 系統取消諮詢通知 (${meetingId})`")
mapS0Subject.set("S0-S4-Cancel-Consultant", "`[Arctics Academy升大學顧問平台] 學生取消諮詢通知 (${meetingId})`")
mapS0Subject.set("S0-S4-Cancel-Student", "`[Arctics Academy升大學顧問平台] 諮詢取消成功通知 (${meetingId})`")

var mapS0CompiledEmail = new Map()
mapS0CompiledEmail.set("S0-Any", Pug.compileFile('statics/emails/pugs/S0-Any.pug'))
mapS0CompiledEmail.set("S0-S0-Book-Consultant", Pug.compileFile('statics/emails/pugs/S0-S0-Book-Consultant.pug'))
mapS0CompiledEmail.set("S0-S0-Book-Student", Pug.compileFile('statics/emails/pugs/S0-S0-Book-Student.pug'))
mapS0CompiledEmail.set("S0-S1-Cancel-Consultant", Pug.compileFile('statics/emails/pugs/S0-S1-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S1-Cancel-Student", Pug.compileFile('statics/emails/pugs/S0-S1-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S2-Cancel-Consultant", Pug.compileFile('statics/emails/pugs/S0-S2-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S2-Cancel-Student", Pug.compileFile('statics/emails/pugs/S0-S2-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S2-Pay-Student", Pug.compileFile('statics/emails/pugs/S0-S2-Pay-Student.pug'))
mapS0CompiledEmail.set("S0-S3-Cancel-Consultant", Pug.compileFile('statics/emails/pugs/S0-S3-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S3-Cancel-Student", Pug.compileFile('statics/emails/pugs/S0-S3-Cancel-Student.pug'))
mapS0CompiledEmail.set("S0-S4-Cancel-Consultant", Pug.compileFile('statics/emails/pugs/S0-S4-Cancel-Consultant.pug'))
mapS0CompiledEmail.set("S0-S4-Cancel-Student", Pug.compileFile('statics/emails/pugs/S0-S4-Cancel-Student.pug'))

var mapS0TemplateString = new Map()
mapS0TemplateString.set("S0-S0-Book-Consultant", fileToString('statics/emails/texts/S0-S0-Book-Consultant.txt'))
mapS0TemplateString.set("S0-S0-Book-Student", fileToString('statics/emails/texts/S0-S0-Book-Student.txt'))
mapS0TemplateString.set("S0-S1-Cancel-Consultant", fileToString('statics/emails/texts/S0-S1-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S1-Cancel-Student", fileToString('statics/emails/texts/S0-S1-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S2-Cancel-Consultant", fileToString('statics/emails/texts/S0-S2-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S2-Cancel-Student", fileToString('statics/emails/texts/S0-S2-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S2-Pay-Student", fileToString('statics/emails/texts/S0-S2-Pay-Student.txt'))
mapS0TemplateString.set("S0-S3-Cancel-Consultant", fileToString('statics/emails/texts/S0-S3-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S3-Cancel-Student", fileToString('statics/emails/texts/S0-S3-Cancel-Student.txt'))
mapS0TemplateString.set("S0-S4-Cancel-Consultant", fileToString('statics/emails/texts/S0-S4-Cancel-Consultant.txt'))
mapS0TemplateString.set("S0-S4-Cancel-Student", fileToString('statics/emails/texts/S0-S4-Cancel-Student.txt'))


module.exports = { mapS0Subject, mapS0CompiledEmail, mapS0TemplateString }