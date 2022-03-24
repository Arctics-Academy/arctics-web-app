// Packages
const fs = require('fs')

// Models
const { ConsultantModel } = require('../models/consultant.models')
const { MeetingModel } = require('../models/meeting.models')
const { AnnouncementModel } = require('../models/system.models')

// Utils
const TimeUtil = require('../utils/time.utils')
const PasswordUtil = require('../utils/password.utils')
const { FileNotFoundError, UserDoesNotExistError } = require('../utils/error.utils')
const { sendSystemStudentCardVerification } = require('../utils/email.utils')


const getConsultantDashboard = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('profile announcements meetings purse');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant;
}

const getConsultantProfile = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('profile');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant;
}

const getConsultantPurse = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('purse');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant;
}

const getConsultantMeetingsCalendar = async (id, date) => {
    // load meetings
    let consultant = await ConsultantModel.findOne({ id: id }).select('meetings')
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    
    // filter settings
    date = new Date(date)
    year = date.getFullYear()
    month = date.getMonth()
    let [start, end] = TimeUtil.yearMonthToDatetimeRange(year, month)
    
    // filter all
    let answer = {}
    answer.future = consultant.meetings.future.filter(meeting => (start < meeting.startTimestamp && meeting.startTimestamp < end))
    answer.past = consultant.meetings.past.filter(meeting => (start < meeting.startTimestamp && meeting.startTimestamp < end))
    answer.cancelled = consultant.meetings.cancelled.filter(meeting => (start < meeting.startTimestamp && meeting.startTimestamp < end))
    
    return answer
}

const getConsultantMeetingsList = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('meetings');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant;
}

const getConsultantNotifications = async (id) => {
    // load data
    let consultant = await ConsultantModel.findOne({ id: id }).select('announcements notifications')
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }

    // replace announcements
    for (item in consultant.announcements) {
        let temp = await AnnouncementModel.findOne({ id: item.id })
        item = Object.assign(item, temp)
    }
    return consultant
}

const getConsultantNotificationCount = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('announcements.unreadCount notifications.unreadCount');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant.announcements.unreadCount + consultant.notifications.unreadCount
}

const getConsultantBankInfo = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id }).select('purse.bankList');
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    return consultant;
}

const consultantAddBankInfo = async (id, data) => {
    // data verification?
    let consultant = await ConsultantModel.findOne({ id: id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    let bank = {
        default: (consultant.purse.length > 0 ? false : true),
        usage: (data.usage === undefined ? "" : data.usage),
        bankNo: data.bankNo,
        accountNo: data.accountNo
    }

    consultant.purse.bankList.push(bank)
    await consultant.save()
}

const consultantCancelMeeting = async (consultantId, meetingId) => {
    try {
        // Consultant Side
        // a. Move meeting
        let startTimestamp
        let consultant = await ConsultantModel.findOne({ id: consultantId });
        if (consultant === null) {
            throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
        }
        for (let i = 0; i < consultant.future.size(); i++) {
            if (consultant.future[i].id === meetingId) {
                startTimestamp = consultant.future[i].startTimestamp
                consultant.canceled.push(consultant.future[i])
                delete consultant.future[i]
                break
            }
        }
        consultant.canceled.sort(privateCompareMeeting)
        // b. Add notification
        consultant.notifications.push({
            id: consultant.notifications.size(),
            timestamp: new Date(),
            title: `您在${TimeUtil.timestampToString(startTimestamp)}的諮詢已經取消，請前往「我的諮詢」查看！`,
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
    let consultant = await ConsultantModel.findOne({ id: consultantId });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    
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
    // Check file
    if (file === undefined) {
        throw new FileNotFoundError(`consultant (${id}) profile photo not received`)
    }

    // Save to database
    let consultant = await ConsultantModel.findOne({ id: id })
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`)
    }
    let imgFile = fs.readFileSync(file.path)
    let imgEncoded = imgFile.toString('base64')
    let media ={
        timestamp: new Date(),
        type: file.mimetype,
        data: new Buffer.from(imgEncoded, 'base64')
    }
    consultant.profile.studentCard = media
    await consultant.save()

    // Send system verification
    sendSystemStudentCardVerification(consultant, file)

    // Cleanup
    fs.unlinkSync(file.path)
}

const consultantUpdateProfile = async (id, data) => {
    let consultant = await ConsultantModel.findOne({ id: id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }

    for (prop in data) {
        try {
            consultant.profile[prop] = data[prop]
        }
        catch (e) {
            console.error(e)
            continue
        }
    }

    await consultant.save()
}

const consultantAddProfilePhoto = async (id, file) => {
    let consultant = await ConsultantModel.findOne({ id: id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }
    
    if (file === undefined) {
        consultant.profile.photo = null
    }
    else {
        let imgFile = fs.readFileSync(file.path)
        let imgEncoded = imgFile.toString('base64')
        let media = 
        {
            timestamp: new Date(),
            type: file.mimetype,
            data: new Buffer.from(imgEncoded, 'base64')
        }
        consultant.profile.photo = media
        fs.unlinkSync(file.path)
    }

    await consultant.save()
}

const consultantUpdateTimetable = async (id, timetable) => {
    let consultant = await ConsultantModel.findOne({ id: id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${id} does not exist`);
    }

    // should run validation checks?
    consultant.profile.timetable = timetable

    await consultant.save()
}

const consultantUpdatePassword = async (reqBody) => {
    let consultant = await ConsultantModel.findOne({ id: reqBody.id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${reqBody.id} does not exist`);
    }
    
    let passwordEncrypted = PasswordUtil.matchHashPassword(reqBody.oldPassword, consultant.user.passwordSalt)
    if (consultant.user.passwordEncrypted !== passwordEncrypted) {
        return { status: "failed", message: "incorrect original password" }
    }
    else {
        let [passwordEncrypted, passwordSalt] = PasswordUtil.getHashedPassword(reqBody.newPassword)
        consultant.user.passwordEncrypted = passwordEncrypted
        consultant.user.passwordSalt = passwordSalt
        await consultant.save()
        return { status: "success", message: "password successfully changed"}
    }
}

const consultantUpdateEmail = async (reqBody) => {
    let consultant = await ConsultantModel.findOne({ id: reqBody.id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${reqBody.id} does not exist`);
    }

    let consultantSearch = await ConsultantModel.find({ "user.email": reqBody.email })
    if (consultantSearch.length !== 0) {
        return { status: "failed", message: "another account with the same email already exists" }
    }
    
    consultant.user.email = reqBody.email
    consultant.profile.email = reqBody.email
    consultant.profile.emailVerified = false
    await consultant.save()
    return { status: "success", message: "consultant email update successful" }
}

const consultantUpdateMobile = async (reqBody) => {
    let consultant = await ConsultantModel.findOne({ id: reqBody.id });
    if (consultant === null) {
        throw new UserDoesNotExistError(`consultant with id ${reqBody.id} does not exist`);
    }
    
    consultant.profile.mobile = reqBody.mobile
    consultant.profile.mobileVerified = false
    await consultant.save()
    return { status: "success", message: "consultant mobile update successful" }
}

const getMeetingQuestionsAndConditions = async (meetingId) => {
    let meeting = await MeetingModel.findOne({ id: meetingId })
    if (!meeting) throw `error x: meeting ${meetingId} returned empty object`
    return { questions: meeting.details.questions, conditions: meeting.details.conditions }
    // TODO: Catch null meeting
    // TODO: Unify with other controller output
}


// Util Functions
const privateCompareMeeting = function(meeting1, meeting2) {
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
    consultantAddProfilePhoto,
    consultantUpdateProfile,
    consultantUpdateTimetable,
    consultantUpdatePassword,
    consultantUpdateEmail,
    consultantUpdateMobile,

    getMeetingQuestionsAndConditions,
}