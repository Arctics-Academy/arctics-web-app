// Models
const { StudentModel } = require('../models/student.models')
const { DiscountCodeModel } = require('../models/system.models')

// Utils
const { UserDoesNotExistError } = require('../utils/error.utils')

const getStudentDashboard = async function(reqBody) {
    let dashboard = StudentModel.findOne({ id: reqBody.id }).select("profile announcements meetings");
    return dashbaord
}

const getStudentProfile = async function(reqBody) {
    let profile = await StudentModel.findOne({ id: reqBody.id }).select('profile')
    if (profile === null) {
        throw new UserDoesNotExistError(`student with id ${reqBody.id} does not exist`)
    }
    return profile
}

const studentUpdateProfile = async function (reqBody) {
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

const getStudentNotificationCount = async (reqBody) => {
    let student = await StudentModel.findOne({ id: reqBody.id }).select('announcements.unreadCount notifications.unreadCount')
    return student.announcements.unreadCount + student.notifications.unreadCount
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
    getStudentProfile,
    getStudentNotificationCount,

    studentUpdateProfile,
    studentVerifyDiscountCode,
}