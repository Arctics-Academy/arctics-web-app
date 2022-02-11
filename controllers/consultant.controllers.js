// Models
const { ConsultantModel } = require('../models/consultant.models')
const { AnnouncementModel } = require('../models/system.models')

// Utils
const timeUtil = require('../utils/time.utils')


const getConsultantDashboard = async function(id) {
    let dashboard = await ConsultantModel.findOne({ id: id }).select('profile announcements meetings purse')
    return dashboard
}

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

const getConsultantNotifications = async function(id) {
    // load data
    let notifs = await ConsultantModel.findOne({ id: id }).select('announcements notifications')

    // replace announcements
    for (item in notifs.announcements) {
        let temp = await AnnouncementModel.findOne({ id: item.id })
        item = Object.assign(item, temp)
    }
    return notifs
}


// Exports
module.exports = 
{ 
    getConsultantDashboard,
    getConsultantProfile, 
    getConsultantPurse,
    getConsultantMeetingsCalendar,
    getConsultantMeetingsList,
    getConsultantNotifications
}