const { ConsultantModel } = require('../models/consultant.models')
const { MeetingModel } = require('../models/meeting.models')


const getConsultant = async function(id) {
    return await ConsultantModel.findOne({ id: id });
};

const getMeeting = async function(id) {
    return await MeetingModel.findOne({ id: id });
};

module.exports = { getConsultant, getMeeting };