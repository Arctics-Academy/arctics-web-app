const database = require('../utils/database.utils');

const getConsultantProfile = async function(id) {
    let consultant = await database.getConsultant(id);
    return { id: id, profile: consultant.profile };
}

module.exports = { getConsultantProfile };