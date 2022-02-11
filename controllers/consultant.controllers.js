// Models
const { ConsultantModel } = require('../models/consultant.models')

// Utils
const timeUtil = require('../utils/time.utils')


const getConsultantProfile = async function (id) {
    let profile = await ConsultantModel.findOne({ id: id }).select('profile')
    return profile
}
}

module.exports = { getConsultantProfile };{ 
    getConsultantProfile, 
    getConsultantPurse
