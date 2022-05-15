// Utils
const { fileToString } = require('../../../utils/file.utils');


// Main Functions
const SystemEmail = {
    "SystemStudentIdRequest":
        ["`[Arctics系統] 學生證驗證 (ID: ${userObj.id})`", fileToString('statics/system/texts/System-StudentIdRequest.txt')],
    "SystemPaymentRequest":
        ["`[Arctics系統] 付款驗證 (ID: ${meetingObj.id})`", fileToString('statics/system/texts/System-PaymentRequest.txt')]
};


// Exports
module.exports = { SystemEmail };