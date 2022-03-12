// Models
const { StudentModel } = require('../models/student.models')

// Utils
const { UserDoesNotExistError } = require('../utils/error.utils')


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


module.exports = 
{
    getStudentProfile,
    getStudentNotificationCount,

    studentUpdateProfile,
}