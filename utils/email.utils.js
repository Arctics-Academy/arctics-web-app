const dotenv = require('dotenv');
dotenv.config();

const { read_file_to_base64 } = require('./file.utils')

const pug = require('pug');
var compiled_early_access_email = pug.compileFile('statics/emails/templates/early-access.pug');

const form_data = require('form-data');
const mail_composer = require('nodemailer/lib/mail-composer');
const mailgun = require('mailgun.js');
const mailgun_domain = 'mailgun.arctics.academy';
const mailgun_config = new mailgun(form_data);
const mailgun_instance = mailgun_config.client({ username: 'api', key: process.env.MAILGUN_API_KEY });


let early_access_email = async (data) => {
    // Build mime message using nodemailer
    let mail_content = 
    {
        from: `"Arctics升學顧問" <hello@mailgun.arctics.academy>`,
        subject: `Arctics升學平台 搶先體驗`,
        text: `Something about early access...`,
        html: compiled_early_access_email(data),
        attachments: 
        [
            {
                filename: `logo.png`,
                encoding: `base64`,
                contentType: `image/png`,
                content: read_file_to_base64('statics/emails/images/logo.png'),
                cid: `<logo.png@arctics.academy>`
            }
        ]
    };
    const raw_mime_mail = new mail_composer(mail_content); // converting to MIME
    const compiled_mime_mail = await raw_mime_mail.compile().build();

    // Build mailgun object
    let mail_object = {
        to: [ data.email ],
        message: compiled_mime_mail
    }

    // Send mail through mailgun
    try {
        await mailgun_instance.messages.create(mailgun_domain, mail_object);
    } 
    catch(e) {
        console.log(e);
    }
};


module.exports = { early_access_email }