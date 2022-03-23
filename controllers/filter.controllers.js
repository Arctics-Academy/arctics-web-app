// Models
const { ConsultantModel } = require('../models/consultant.models');

// Utils
const { castToStudentListConsultant } = require('../utils/profile.utils')

// Functions
async function filterConsultants(reqBody) {
    let mongoQuery = {
        "profile.school": (reqBody.query.school ? { $in: reqBody.query.school } : { $exists: true }),
        "profile.field": (reqBody.query.field ? { $in: reqBody.query.field }: { $exists: true }),
        "profile.major": (reqBody.query.major ? { $in: reqBody.query.major } : { $exists: true }),
        "profile.studentCardVerified": true
    }

    let rawResults = await ConsultantModel.find(mongoQuery).select("id profile");
    let cleanedResults;
    for (consultant in rawResults) {
        cleanedResults.push(castToStudentListConsultant(consultant));
    }
    
    return cleanedResults;
}


module.exports =
{
    filterConsultants,
}