// Models
const { ConsultantModel } = require('../models/consultant.models');

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
        let studentListConsultant = {
            consultantId: consultant.id,
            photo: consultant.profile.photo,
            price: consultant.profile.price,
            school: consultant.profile.school,
            count: consultant.profile.count,
            labels: consultant.profile.labels,
            intro: consultant.profile.intro,
            star: consultant.profile.star
        };
        cleanedResults.push(studentListConsultant);
    }
    
    return cleanedResults;
}


module.exports =
{
    filterConsultants,
}