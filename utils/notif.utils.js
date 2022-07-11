// Models
const { ConsultantModel } = require('../models/consultant.models')
const { StudentModel } = require('../models/student.models')

// Utils
const { UserDoesNotExistError } = require('./error.utils')


// Main Functions
// add passed notification to user
const pushNotification = async (userId, notifTitle, notifContent) => {
    let user = null;
    if (userId.substr(0, 2) === "TR") {
        user = await ConsultantModel.findOne({ id: userId });
    }
    if (userId.substr(0, 2) === "ST") {
        user = await StudentModel.findOne({ id: userId });
    }
    if (user === null) {
        throw new UserDoesNotExistError(`user with id ${userId} does not exist`);
    }

    let notification = {
        id: user.notifications.list.length+1,
        timestamp: new Date(),
        titile: notifTitle,
        content: notifContent,
        read: false
    }

    user.notifications.list.push(notification);
    user.notification.unreadCount += 1;
    await user.save()
}


// Exports
module.exports = 
{ 
    pushNotification,
}