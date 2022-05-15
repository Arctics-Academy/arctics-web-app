// Models
const req = require('express/lib/request');
const { ProfilePhotoUploadMiddleware } = require('../middlewares/upload.middlewares');
const { ConsultantModel } = require('../models/consultant.models');

// Utils
const { castToStudentListConsultant } = require('../utils/profile.utils')

// Functions
const filterConsultants = async (reqBody) => {

    console.log("reqbody");
    console.log(reqBody);
    
    let mongoQuery = {};
    mongoQuery["profile.studentCardVerified"] = true;
    if (reqBody.query.major) {
        mongoQuery["profile.major"] ={ $in: reqBody.query.major };
    }
    if (reqBody.query.school) {
        mongoQuery["profile.school"] ={ $in: reqBody.query.school };
    }
    if (reqBody.query.field) {
        mongoQuery["profile.field"] ={ $in: reqBody.query.field };
    }
    
    console.log(mongoQuery);

    let rawResults = await ConsultantModel.find(mongoQuery).select("id profile");

    let cleanedResults = [];
    for (consultant of rawResults) {
        cleanedResults.push(castToStudentListConsultant(consultant));
    }
    
    return cleanedResults;
}


module.exports =
{
    filterConsultants,
}