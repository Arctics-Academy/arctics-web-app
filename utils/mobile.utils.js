require('dotenv').config({ path: __dirname + '/../.env' });
var aws = require('aws-sdk');
aws.config.update({ region: 'ap-southeast-1'})

const OTP_MESSAGE = (code) => {
    return `${code}是您的Arctics手機驗證碼。提醒您於十分鐘之內輸入系統，謝謝！`
}

const sendMobileOtp = (phoneNo, code) => {
    var phoneNo = privateAddCountryCode(phoneNo, '886');
    var params = {
       Message: OTP_MESSAGE(code),
       PhoneNumber: phoneNo,
    }

    return new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise()
    .catch(err => {
        if (err) throw new Error(`Message sent to ${phoneNo} failed. Error: ${err}`)
    })
}

const privateAddCountryCode = (phoneNo, countrycode) => {
    if (phoneNo.length === 10) {
        let altered = new String(phoneNo);
        altered = altered.slice(1);
        return '+' + countrycode + altered;
    } else {
        return '+' + countrycode + phoneNo;
    }
}

module.exports = { sendMobileOtp }