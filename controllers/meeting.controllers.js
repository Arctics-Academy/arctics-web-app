// Models
const { StudentModel } = require('../models/student.models');
const { MeetingModel } = require('../models/meeting.models');
const { ConsultantModel } = require('../models/consultant.models');
const { genMeetingID } = require('../utils/id.utils');

// Utils
const { slotToStartDate, startDateToSlot } = require('../utils/timetable.utils');

const addMeeting = async (reqBody) => {
    let consultant = await ConsultantModel.findOne({ id: reqBody.consultantId });
    let student = await StudentModel.findOne({ id: reqBody.studentId });
    let count = await MeetingModel.countDocuments();

    // console.log(consultant, student)

    // TODO: perform valid checks

    let meetingObj = {
        id: genMeetingID(count),
        details: {
            meetingSlot: reqBody.slot,
            meetingStartTime: slotToStartDate(reqBody.year, reqBody.month, reqBody.date, reqBody.slot),
    
            studentId: reqBody.studentId,
            studentSurname: student.profile.surname,
            studentName: student.profile.name,
            studentSchool: student.profile.school,
            studentYear: student.profile.year,
            
            consultantId: reqBody.consultantId,
            consultantSurname: consultant.profile.surname,
            consultantName: consultant.profile.name,
            consultantSchool: consultant.profile.school,
            consultantMajor: consultant.profile.major,
            consultantYear: consultant.profile.year,
            consultantPrice: consultant.profile.price
        },
        order: {
            confirmed: true,
            submitted: false,
        },
        records: [{ timestamp: new Date(), description: "預約會議"}],
    
    }

    // create meeting
    let newMeeting = new MeetingModel(meetingObj);
    await newMeeting.save();

    // save to consultant
    let consultantMeeting = {
        id: meetingObj.id,
        status: "future",
        startTimestamp: meetingObj.details.meetingStartTime,
        studentName: meetingObj.details.studentSurname+meetingObj.details.studentName,
        studentYear: meetingObj.details.studentYear,
        studentItems: [],
        remark: "",
        comment: ""
    };
    consultant.meetings.future.push(consultantMeeting);
    await consultant.save();

    // save to student
    let studentMeeting = {
        id: meetingObj.id,
        active: true,
        startTimestamp: meetingObj.details.meetingStartTime,
        consultantName: meetingObj.details.consultantSurname+meetingObj.details.consultantName,
        consultantYear: meetingObj.details.consultantYear,
        studentItems: [],
        remark: "",
        comment: ""
    };
    student.meetings.future.push(studentMeeting);
    await student.save();

    return newMeeting
}

module.exports = { addMeeting }