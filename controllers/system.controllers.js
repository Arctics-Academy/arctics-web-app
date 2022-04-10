const { ConsultantModel } = require('../models/consultant.models')
const { StudentModel } = require('../models/student.models')

const systemValidateConsultantStudentCard = async (id) => {

    // FIXME: Send confirmation once student card is confirmed

    let consultant = await ConsultantModel.findOne({ id: id })
    consultant.profile.studentCardVerified = true
    await consultant.save()
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