// Models
const { StudentModel } = require('../models/student.models')
const { ConsultantModel } = require('../models/consultant.models')
const { DiscountCodeModel } = require('../models/system.models')

// Utils
const { UserDoesNotExistError } = require('../utils/error.utils')
const { castToStudentListConsultant } = require('../utils/profile.utils')

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

const getStudentNotificationCount = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select('announcements.unreadCount notifications.unreadCount')
    return student.announcements.unreadCount + student.notifications.unreadCount
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


module.exports = 
{
    getStudentDashboard,
    getStudentList,
    getStudentProfile,
    getStudentNotificationCount,

    studentUpdateProfile,
    studentAddToList,
    studentDeleteFromList,
    studentClearList,
    studentVerifyDiscountCode,
}