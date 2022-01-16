const dotenv = require('dotenv');
//dotenv.config({ path: '../.env' });
dotenv.config();

const mimemessage = require('mimemessage');

const pug = require('pug');
var compiled_early_access_email = pug.compileFile('statics/emails/templates/early-access.pug');

const aws = require('aws-sdk');
const aws_params = {
    accessKeyId: process.env.AWS_SES_ID,
    secretAccessKey: process.env.AWS_SES_KEY,
    region: 'ap-southeast-1'
};


const aws_ses = new aws.SES(aws_params);
let send_email = (sender, recipient, subject, content) => {
    let params = {
        Source: sender,
        Destination: { ToAddresses: recipient },
        ReplyToAddresses: [],
        Message: {
            Subject: { Charset: "utf-8", Data: subject },
            Body: { Html: { Charset: "utf-8", Data: content } }
        }
    }
    return aws_ses.sendEmail(params).promise();
}
let send_raw_email = async (message_string) => {
    aws_ses.sendRawEmail({ RawMessage: { Data: message_string } }, (err, sesdata, res) => {
        if (err) {
            console.error('err', err);
            console.error('sesdata', sesdata);
        } 
    });
}

let early_access_email = async (data) => {
    let subject = "Arctics升學平台 搶先體驗";
    data.subject = subject;
    let html_content = compiled_early_access_email(data);

    var message = mimemessage.factory({ contentType: 'multipart/mixed', body: [] });
    
    message.header('From', 'Arctics升學平台 <arcticsteam.official@gmail.com>');
    message.header('To', data.email);
    message.header('Subject', subject);

    var alt_entity = mimemessage.factory({ contentType: 'multipart/alternate', body: [] });
    var html_entity = mimemessage.factory({
        contentType: 'text/html;charset=utf-8',
        body: html_content
    });
    var plain_entity = mimemessage.factory({
        body: 'Something about early access...'
    });
    var logo_entity = mimemessage.factory({
        contentType: 'image/png',
        contentTransferEncoding: 'base64',
        body: "iVBORw0KGgoAAAANSUhEUgAAARkAAABTCAYAAACrpHOpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjUgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTIyVDAwOjU0OjAxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOC0yMlQwMDo1NzozNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOC0yMlQwMDo1NzozNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MTM0ZWVmYS05MzRk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"
    });
    logo_entity.header('Content-Disposition', 'inline; filename="logo.png"');
    logo_entity.header('Content-ID', '<logo.png@arctics.academy>');

    alt_entity.body.push(html_entity);
    // alt_entity.body.push(plain_entity);
    message.body.push(alt_entity);
    message.body.push(logo_entity);
    
    await send_raw_email(message.toString());
}


module.exports = { early_access_email }