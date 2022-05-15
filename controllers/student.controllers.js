// Models
const { StudentModel } = require('../models/student.models')
const { MeetingModel } = require('../models/meeting.models')
const { ConsultantModel } = require('../models/consultant.models')
const { DiscountCodeModel, AnnouncementModel } = require('../models/system.models')

// Utils
const { UserDoesNotExistError, MeetingDoesNotExistError } = require('../utils/error.utils')
const { castToStudentListConsultant } = require('../utils/profile.utils')
// const { sendSystemMeetingPaymentVerification } = require('../utils/email.utils');
// const { pushNotification } = require('../utils/notif.utils');

const getStudentDashboard = async (reqBody) => {
    let dashboard = await StudentModel.findOne({ id: reqBody.id }).select("profile announcements meetings");
    return dashboard
}

const getStudentProfile = async (reqBody) => {
    let profile = await StudentModel.findOne({ id: reqBody.id }).select('profile')
    if (profile === null) {
        throw new UserDoesNotExistError(`student with id ${reqBody.id} does not exist`)
    }
    return profile
}

const getStudentList = async (reqBody) => {
    let list = await StudentModel.findOne({ id: reqBody.id }).select("list");
    return list
}

const getStudentMeetings = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select("meetings");
    return student;
}

const getStudentNotificationCount = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select('announcements.unreadCount notifications.unreadCount')
    return student.announcements.unreadCount + student.notifications.unreadCount
}

const getStudentNotifications = async (reqBody) => {
    // load data
    let student = await StudentModel.findOne({ id: reqBody.id }).select('announcements notifications');
    if (student === null) {
        throw new UserDoesNotExistError(`student with id ${id} does not exist`);
    }

    // replace announcements
    for (announcement of student.announcements.list) {
        let temp = await AnnouncementModel.findOne({ id: announcement.id });
        item = Object.assign(item, temp);
    }
    return student;
}

const studentUpdateProfile = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id })
    if (student === null) {
        throw new UserDoesNotExistError(`consultant with id ${reqBody.id} does not exist`)
    }

    for (prop in reqBody.data) {
        try {
            student.profile[prop] = reqBody.data[prop]
        }
        catch (e) {
            console.error(e)
            continue
        }
    }

    await student.save()
}

const studentAddToList = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select("list");
    let newListItem = await ConsultantModel.findOne({ id: reqBody.id }).select("profile");
    newListItem = castToStudentListConsultant(newListItem);
    student.list.push(newListItem);
    await student.save();
}

const studentDeleteFromList = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select("list");
    student.list = student.list.filter(item => item.consultantId !== reqBody.consultantId);
    await student.save();
}

const studentClearList = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select("list");
    student.list = [];
    await student.save();
}

const studentViewConsultant = async (reqBody) => {
    let consultant = await ConsultantModel.findOne({ id: reqBody.consultantId }).select("id profile timetable");
    return consultant;
    // TODO: Union consultant meetings, student meetings, and consultant timetable
}

const studentVerifyDiscountCode = async (reqBody) => {
    let discount = await DiscountCodeModel.findOne({ code: reqBody.discount });
    if (!discount) {
        return { status: "failed", code: 1, message: `discount with code (${reqBody.discount} does not exist` };
    }
    else {
        // time check
        let now = new Date();
        if (now > discount.expiredTimestamp) {
            return { status: "failed", code: 2, message: `discount with code (${reqBody.discount}) has already expired` };
        }
        // user check
        if (discount.userExclusive && !discount.userAllowed.includes(reqBody.id)) {
            return { status: "failed", code: 3, message: `discount with code (${reqBody.discount}) is not accessible by student (${reqBody.id})` };
        }
        // passed all checks
        return { status: "success", code: 0, data: discount };
    }
}

// const studentReadNotifications = async (consultantId, announcementIdArray, notificaionIdArray) => {
const studentReadNotifications = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.studentId });
    if (student === null) {
        throw new UserDoesNotExistError(`student with id ${id} does not exist`);
    }
    
    for (announcement of student.announcements.list) {
        if (reqBody.announcementIds.includes(announcement.id)) {
            announcement.read = true;
            student.announcements.unreadCount -= 1;
        }
    }

    for (notification of student.notifications.list) {
        if (reqBody.notificaionIds.includes(notification.id)) {
            notification.read = true;
            student.notifications.unreadCount -= 1;
        }
    }
    
    await student.save();
    return true;
}

// s
// const studentSubmitPaymentProof = async (reqBody, reqFile) => {
//     // find meeting
//     let meeting = await MeetingModel.findOne({ id: reqBody.meetingId });
//     if (meeting === null) {
//         throw new MeetingDoesNotExistError(`meeting with id ${reqBody.meetingId} does not exist`);
//     }
    
//     // push meeting record
//     let record = { timestamp: new Date(), description: "收到學生上傳付款證明" };
//     meeting.records.push(record);

//     // TODO: Should add push notitfication system
//     // await pushNotification(meeting.details.studentId, `已收到諮詢付款證明`, ``); 

//     // add details to meeting object
//     let imgFile = fs.readFileSync(reqFile.path);
//     let imgEncoded = imgFile.toString('base64');
//     let media = { timestamp: new Date(), type: reqFile.mimetype, data: new Buffer.from(imgEncoded, 'base64') };
//     meeting.order.paymentReceipt = media;

//     // TODO: should send email to us
//     await sendSystemMeetingPaymentVerification(meeting, reqFile);
    
//     // cleanup
//     await meeting.save();
//     fs.unlinkSync(reqFile.path);
// }


module.exports = 
{
    getStudentDashboard,
    getStudentList,
    getStudentMeetings,
    getStudentProfile,
    getStudentNotificationCount,
    getStudentNotifications,

    studentUpdateProfile,
    studentAddToList,
    studentDeleteFromList,
    studentClearList,
    studentReadNotifications,
    studentViewConsultant,
    studentVerifyDiscountCode,

    studentSubmitPaymentProof,
}