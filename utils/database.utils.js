const { MeetingModel } = require('../models/meeting.models')


const getMeeting = async function(id) {
    return await MeetingModel.findOne({ id: id });
};

module.exports = { getMeeting };