// Packages
const fs = require('fs')

// Models
const { ConsultantModel } = require('../models/consultant.models')
const { MeetingModel } = require('../models/meeting.models')
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

const getConsultantNotificationCount = async (id) => {
    let consultant = await ConsultantModel.findOne(id).select('announcements.unreadCount notifications.unreadCount')
    return consultant.announcement.unreadCount + consultant.notifications.unreadCount
}

const getConsultantBankInfo = async (id) => {
    let list = await ConsultantModel.findOne({ id: id }).select('purse.bankList')
    return list
}

const consultantAddBankInfo = async (id, data) => {
    // data verification?
    let consultant = await ConsultantModel.findOne({ id: id })
    let bank = {
        default: (consultant.pusre.length > 0 ? false : true),
        usage: (data.usage === undefined ? "" : data.usage),
        bankNo: data.bankNo,
        accountNo: data.accountNo
    }

    consultant.purse.bankList.push(bank)
    await consultant.save()
}

const consultantCancelMeeting = async function(consultantId, meetingId) {
    try {
        // Consultant Side
        // a. Move meeting
        let startTimestamp
        let consultant = await ConsultantModel.findOne({ id: consultantId })
        for (let i = 0; i < consultant.future.size(); i++) {
            if (consultant.future[i].id === meetingId) {
                startTimestamp = consultant.future[i].startTimestamp
                consultant.canceled.push(consultant.future[i])
                delete consultant.future[i]
                break
            }
        }
        consultant.canceled.sort(_compareMeeting)
        // b. Add notification
        consultant.notifications.push({
            id: consultant.notifications.size(),
            timestamp: new Date(),
            title: `您在${timeUtil.timestampToString(startTimestamp)}的諮詢已經取消，請前往「我的諮詢」查看！`,
            content: null,
            read: false
        })
        // 0. Save
        await consultant.save()

        // Meeting Side
        // a. Write record
        let meeting = await MeetingModel.findOne({ id: meetingId })
        meeting.records.push({ timestamp: new Date(), description: "consultant canceled meeting" })
        // 0. Save
        await meeting.save()
        
        // Student Side
        // ...
        
        // some other stuff, like push notifications et al.
        return true
    }
    catch (e) {
        console.error(e)
        return false
    }
}

const consultantReadNotifications = async (consultantId, announcementIdArray, notificaionIdArray) => {
    let consultant = await ConsultantModel.findOne(consultantId)
    if (!consultant) throw `error x: consultant ${consultantId} returned empty object`
    
    for (announcement of consultant.announcements.list) {
        if (announcementIdArray.includes(announcement.id)) {
            announcement.read = true
            consultant.announcements.unreadCount -= 1
        }
    }

    for (notification of consultant.notifications.list) {
        if (notificaionIdArray.includes(notification.id)) {
            notification.read = true
            consultant.notifications.unreadCount -= 1
        }
    }
    
    await consultant.save()
    return true
}

const consultantAddStudentId = async (id, file) => {
    // save info to database
    let consultant = await ConsultantModel.findOne(id)

    let imgFile = fs.readFileSync(file.path)
    let imgEncoded = imgFile.toString()
    
    let media =
    {
        timestamp: new Date(),
        type: file.mimetype,
        data: new Buffer.from(imgEncoded, 'base64')
    }

    consultant.profile.studentCard = media
    await consultant.save()

    // send system verification email...
    // MISSING

    // cleanup
    fs.unlinkSync(file.path)
}

const consultantUpdateProfile = async (id, data, file) => {
    let consultant = await ConsultantModel.findOne({ id: id })

    for (const prop in data) {
        try {
            consultant.profile[prop] = data[prop]
        }
        catch (e) {
            console.error(e)
            continue
        }
    }

    if (file) {
        let imgFile = fs.readFileSync(file.path)
        let imgEncoded = imgFile.toString()
        let media = 
        {
            timestamp: new Date(),
            type: file.mimetype,
            data: new Buffer.from(imgEncoded, 'base64')
        }
        consultant.profile.photo = media
    }

    await consultant.save()
}

const consultantUpdateTimetable = async (id, timetable) => {
    let consultant = await ConsultantModel.findOne({ id: id })

    // should run validation checks?
    consultant.profile.timetable = timetable

    await consultant.save()
}

const getMeetingQuestionsAndConditions = async (meetingId) => {
    let meeting = await MeetingModel.findOne(meetingId)
    if (!meeting) throw `error x: meeting ${meetingId} returned empty object`
    return { questions: meeting.details.questions, conditions: meeting.details.conditions }
}


// Util Functions
const _compareMeeting = function(meeting1, meeting2) {
    if (meeting1.startTimestamp < meeting2.startTimestamp) return -1
    else if (meeting1.startTimestamp > meeting2.startTimestamp) return 1
    else return 0
}


// Exports
module.exports = 
{ 
    getConsultantDashboard,
    getConsultantProfile, 
    getConsultantPurse,
    getConsultantMeetingsCalendar,
    getConsultantMeetingsList,
    getConsultantNotifications,
    getConsultantBankInfo,
    getConsultantNotificationCount,

    consultantCancelMeeting,
    consultantReadNotifications,
    consultantAddBankInfo,
    consultantAddStudentId,
    consultantUpdateProfile,
    consultantUpdateTimetable,

    getMeetingQuestionsAndConditions,
}