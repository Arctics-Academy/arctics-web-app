const { ConsultantModel } = require('../models/consultant.models')
const { StudentModel } = require('../models/student.models')

const EmailUtils = require('../utils/email.utils');

const systemValidateConsultantStudentCard = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id });
    consultant.profile.studentCardVerified = true;
    await consultant.save();
    await EmailUtils.sendStudentCardVerifiedEmail(consultant);
}

const getConsultantObject = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id })
    consultant.user = null
    return consultant
}

const getStudentObject = async (id) => {
    let student = await StudentModel.findOne({ id: id })
    student.user = null
    return student
}

module.exports = 
{ 
    systemValidateConsultantStudentCard, 
    getConsultantObject,
    getStudentObject,
}