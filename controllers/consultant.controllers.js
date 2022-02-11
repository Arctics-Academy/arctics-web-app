// Models
const { ConsultantModel } = require('../models/consultant.models')

// Utils
const timeUtil = require('../utils/time.utils')


const getConsultantProfile = async function(id) {
    let profile = await ConsultantModel.findOne({ id: id }).select('profile')
    return profile
}

const getConsultantPurse = async function(id) {
    let purse = await ConsultantModel.findOne({ id: id }).select('purse')
    return purse
}

const getConsultantMeetingsCalendar = async function(id, date) {
    // load meetings
    let meeting = await ConsultantModel.findOne({ id: id }).select('meetings')
    
    // filter settings
    year = date.getFullYear()
    month = date.getMonth()
    let start = timeUtil.yearMonthToDatetimeRange(timeUtil.previousMonth(year, month))[0]
    let end = timeUtil.yearMonthToDatetimeRange(timeUtil.nextMonth(year, month))[1]
    
    // filter all
    meeting.future = meeting.future.filter(meeting => (start < meeting.timestamp < end))
    meeting.past = meeting.past.filter(meeting => (start < meeting.timestamp < end))
    meeting.canceled = meeting.canceled.filter(meeting => (start < meeting.timestamp < end))
    
    return meeting
}

const getConsultantMeetingsList = async function(id) {
    let meeting = await ConsultantModel.findOne({ id: id }).select('meetings')
    return meeting
}

// Exports
module.exports = 
{ 
    getConsultantProfile, 
    getConsultantPurse,
    getConsultantMeetingsCalendar,
    getConsultantMeetingsList,
    getConsultantNotifications
}