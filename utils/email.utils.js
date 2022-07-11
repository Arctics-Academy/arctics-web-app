// Setup Environment Variables
const DotEnv = require('dotenv');
DotEnv.config();

// Setup External Modules
const Mailgun = require('mailgun.js');
const FormData = require('form-data');
const MailComposer = require('nodemailer/lib/mail-composer');

// Setup Internal Modules
const { fileToBase64String, getEmailAddressee } = require('./file.utils')
const { mapS0CompiledEmail, mapS0TemplateString, mapS0Subject } = require('../statics/emails/index/s0.data');
const { OtpCompiledEmail, OtpTemplateString, 
    StudentCardVerifiedEmail, StudentCardVerifiedTemplateString, ConsultantWelcomeEmail,
    ConsultantWelcomeTemplateString, } = require('../statics/emails/index/misc.data');
const { timestampToString } = require('../utils/time.utils')

// Setup Mailgun Instances
const MAILGUN_DOMAIN = 'mailgun.arctics.academy';
const MAILGUN_CONFIG = new Mailgun(FormData);
const MAILGUN_INSTANCE = MAILGUN_CONFIG.client({ username: 'api', key: process.env.MAILGUN_API_KEY });


// Main Functions
// sends stage-0 emails
const sendS0Email = async (identifier, consultantObj, studentObj, meetingObj) => {
    // Internal Parameters
    const sendToConsultant = (getEmailAddressee(identifier) === "Consultant" ? true : false);
    const meetingDateObj = new Date(); // swap to meetingobj

    // Html & Text Rendering Parameters
    const consultantName = consultantObj.profile.surname+consultantObj.profile.name;
    const studentName = studentObj.profile.surname+studentObj.profile.name;
    const meetingId = meetingObj.id;
    const month = privateToTwoCharString(meetingDateObj.getMonth());
    const date = privateToTwoCharString(meetingDateObj.getDate());
    const hour = privateToTwoCharString(meetingDateObj.getHours());
    const min = privateToTwoCharString(meetingDateObj.getMinutes());
    const data = { consultantName, studentName, meetingId, month, date, hour, min };
    
    // Final Email Data
    const emailName = (sendToConsultant ? 
        consultantObj.profile.surname+consultantObj.profile.name : 
        studentObj.profile.surname+studentObj.profile.name);
    const emailAddress = (sendToConsultant ? consultantObj.profile.email : studentObj.profile.email);
    const emailSubject = eval(mapS0Subject.get(identifier));
    const emailText = eval(mapS0TemplateString.get(identifier));
    const emailHtml = mapS0CompiledEmail.get(identifier)(data);
    
    // Build Mail Object
    let emailContent = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${emailName}" <${emailAddress}>`,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        attachments:
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: fileToBase64String('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const rawMimeEmail = new MailComposer(emailContent); // converting to MIME
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ `"${emailName}" <${emailAddress}>` ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch(e) {
        console.log(e);
    }
}

// sends otp emails
const sendEmailOtp = async (userObj, otpCode) => {
    // Set up rendering parameters
    let userName = userObj.profile.surname + userObj.profile.name;
    let isConsultant = (userObj.id.substr(0, 2) === 'TR' ? true : false);
    let code = otpCode;

    // Test type of user
    // if (userObj.id.substring(0, 2) === "ST") {
    //     isConsultant = false
    // }
    const data = { userName, isConsultant, code };

    // Email data
    const emailName = userName;
    const emailAddress = userObj.profile.email;
    const emailSubject = `[Arctics Academy升大學顧問平台] 電子郵件驗證碼 (${code})`;
    const emailText = eval(OtpTemplateString);
    const emailHtml = OtpCompiledEmail(data);
    
    // Build email object
    let emailContent = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${emailName}" <${emailAddress}>`,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        attachments:
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: fileToBase64String('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const rawMimeEmail = new MailComposer(emailContent); // converting to MIME
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ `"${emailName}" <${emailAddress}>` ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch(e) {
        console.log(e);
    }
}

// sends student card verification request to our email
const sendSystemStudentCardVerification = async (userObj, file) => {
    const emailSubject = `[Arctics系統] 學生證驗證 (ID: ${userObj.id})`;
    let emailText = "";
    emailText += `嗨Arctics員工：\n\n`;
    emailText += `麻煩驗證以下資料～\n`;
    emailText += `顧問姓名：${userObj.profile.surname+userObj.profile.name}\n`;
    emailText += `顧問年級：${userObj.profile.year}\n`;
    emailText += `顧問學系：${userObj.profile.major}\n`;
    emailText += `顧問電子郵件：${userObj.profile.email}\n\n`;
    emailText += `若學生證正確請點以下網址：\nhttps://arctics.academy/api/system/consultant/confirm-student-id/${userObj.id}\n\n`;
    emailText += `謝謝您\nSam的系統小幫手 敬上`;
    
    // Build email object
    let emailContent = 
    {
        from: `"Arctics系統小幫手" <system@mailgun.arctics.academy>`,
        to: "arcticsteam.official@gmail.com",
        subject: emailSubject,
        text: emailText,
        attachments:
        [
            {
                filename: file.filename,
                encoding: `base64`,
                contentType: file.mimetype,
                content: fileToBase64String(file.path),
                cid: `<student_card@arctics.academy>`
            }
        ]
    };
    const rawMimeEmail = new MailComposer(emailContent); // converting to MIME
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ "arcticsteam.official@gmail.com" ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch (e) {
        console.log(e);
    }
}

// sends student card verified email
const sendStudentCardVerifiedEmail = async (consultantObj) => {
    // 1. Template String Params Setup
    const surname = consultantObj.profile.surname;
    const name = consultantObj.profile.name;
    
    // 2. Build Email Content
    const emailName = consultantObj.profile.surname + consultantObj.profile.name;
    const emailAddress = consultantObj.profile.email;
    const emailSubject = `[Arctics Academy升大學顧問平台] 身份驗證成功`;
    const emailText = eval(StudentCardVerifiedTemplateString);
    const emailHtml = StudentCardVerifiedEmail({ surname, name });
    
    // 3. Build email object
    let emailContent = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${emailName}" <${emailAddress}>`,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        attachments:
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: fileToBase64String('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const rawMimeEmail = new MailComposer(emailContent);
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ `"${emailName}" <${emailAddress}>` ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch (e) {
        console.log(e);
    }
}

// sends welcome email to consultant
const sendConsultantWelcomeEmail = async (consultantObj) => {
    // 1. Template String Params Setup
    const name = consultantObj.profile.name;
    
    // 2. Build Email Content
    const emailName = consultantObj.profile.surname + consultantObj.profile.name;
    const emailAddress = consultantObj.profile.email;
    const emailSubject = `[Arctics Academy升大學顧問平台] 註冊成功`;
    const emailText = eval(ConsultantWelcomeTemplateString);
    const emailHtml = ConsultantWelcomeEmail({ name });
    
    // 3. Build email object
    let emailContent = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        to: `"${emailName}" <${emailAddress}>`,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        attachments:
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: fileToBase64String('statics/emails/imgs/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const rawMimeEmail = new MailComposer(emailContent);
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ `"${emailName}" <${emailAddress}>` ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch (e) {
        console.log(e);
    }
}

const sendSystemMeetingPaymentVerification = async (meetingObj, file) => {
    const emailSubject = `[Arctics系統] 會議付款驗證 (ID: ${meetingObj.id})`;
    let emailText = "";
    emailText += `嗨Arctics員工：\n\n`;
    emailText += `麻煩驗證以下資料～\n`;
    emailText += `會議代碼：${meetingObj.id}\n`;
    emailText += `會議價格：${meetingObj.order.paymentAmount}\n\n`;

    emailText += `匯款人名稱：${meetingObj.order.paymentAccountName}\n`;
    emailText += `匯款帳戶銀行代碼：${(meetingObj.order.paymentBankNo ? meetingObj.order.paymentBankNo : "無填入")}\n`;
    emailText += `匯款帳戶號碼：${(meetingObj.order.paymentAccountNo ? meetingObj.order.paymentAccountNo : "無填入")}\n`;
    emailText += `匯款時間：${meetingObj.order.paymentDate}\n\n`;

    // emailText += `顧問姓名：${userObj.profile.year}\n`;
    // emailText += `學生姓名：${userObj.profile.year}\n`;
    // emailText += `學生電子郵件：${userObj.profile.email}\n\n`;
    
    emailText += `若學生證正確請點以下網址：\nhttps://arctics.academy/api/system/meeting/confirm-payment/${(meetingObj.id).substr(1,5)}\n\n`;
    emailText += `謝謝您\nSam的系統小幫手 敬上`;

    // attachment array
    let attachments = [];
    if (file) {
        attachments.push({
            filename: file.filename,
            encoding: `base64`,
            contentType: file.mimetype,
            content: fileToBase64String(file.path),
            cid: `<payment_receipt@arctics.academy>`
        });
    }
    
    // Build email object
    let emailContent = 
    {
        from: `"Arctics系統小幫手" <system@mailgun.arctics.academy>`,
        to: "arcticsteam.official@gmail.com",
        subject: emailSubject,
        text: emailText,
        attachments: attachments
    };
    const rawMimeEmail = new MailComposer(emailContent); // converting to MIME
    const compiledMimeEmail = await rawMimeEmail.compile().build();

    // Build mailgun object
    let mailgunObj = {
        to: [ "arcticsteam.official@gmail.com" ],
        message: compiledMimeEmail
    };

    // Send mail through mailgun
    try {
        await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
    } 
    catch (e) {
        console.log(e);
    }
}

// sends system email
// files: [{ cid: "string", file: file }]
// const { SystemEmail } = require('../statics/system/index/SystemEmail.index');
// const { SystemAsset } = require('../statics/system/index/SystemAsset.index');
// const sendSystemEmail = async (key, consultant, student, meeting, files, assetids) => {
//     let attachments = [];
//     for (item of files) {
//         attachments.push({
//             filename: item.file.filename,
//             encoding: `base64`,
//             contentType: item.file.mimetype,
//             content: fileToBase64String(item.file.path),
//             cid: item.cid
//         })
//     }
//     for (item of assetids) {
//         if (SystemAsset[item]) {
//             attachments.push(SystemAsset[item]);
//         }
        
//     }

//     const email = {
//         from: `"Arctics系統小幫手" <system@mailgun.arctics.academy>`,
//         to: `"Arctics總信箱" <arcticsteam.official@gmail.com>`,
//         subject: eval(SystemEmail[key][0]),
//         text: eval(SystemEmail[key][1]),
//         attachments: attachments
//     };

//     const mail = {
//         to: [ `"Arctics總信箱" <arcticsteam.official@gmail.com>` ],
//         message: await (new MailComposer(email)).compile().build()
//     };
    
//     try {
//         await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mail);
//     } 
//     catch (e) {
//         console.log(e);
//     }

//     return true;
// }


// Utility Functions
const privateToTwoCharString = (item) => {
    let itemStr = toString(item)
    if (itemStr.length >= 2) return itemStr
    else return "0" + itemStr
}


module.exports = { 
    sendS0Email,
    sendEmailOtp,
    sendSystemStudentCardVerification,
    sendStudentCardVerifiedEmail,
    sendConsultantWelcomeEmail,
    sendSystemMeetingPaymentVerification
}


// const compiled_early_access_email = Pug.compileFile('statics/emails/Pugs/DEMO-EarlyAccess.Pug');
// let early_access_email = async (data) => {
//     // Build mime message using nodemailer
//     let emailContent = 
//     {
//         from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
//         to: `"${data.lastname+data.firstname}" <${data.email}>`,
//         subject: `Arctics升學平台 搶先體驗`,
//         text: fileToString('statics/emails/texts/DEMO-EarlyAccess.txt'),
//         html: compiled_early_access_email(data),
//         attachments: 
//         [
//             {
//                 filename: `logo.png`,
//                 encoding: `base64`,
//                 contentType: `image/png`,
//                 content: fileToBase64String('statics/emails/imgs/logo.png'),
//                 cid: `<logo.png@arctics.academy>`
//             }
//         ]
//     };
//     const rawMimeEmail = new MailComposer(emailContent); // converting to MIME
//     const compiledMimeEmail = await rawMimeEmail.compile().build();

//     // Build mailgun object
//     let mailgunObj = {
//         to: [ `"${data.lastname+data.firstname}" <${data.email}>` ],
//         message: compiledMimeEmail
//     }

//     // Send mail through mailgun
//     try {
//         await MAILGUN_INSTANCE.messages.create(MAILGUN_DOMAIN, mailgunObj);
//     } 
//     catch(e) {
//         console.log(e);
//     }
// };