// Models
const { StudentModel } = require('../models/student.models');
const { MeetingModel } = require('../models/meeting.models');
const { ConsultantModel } = require('../models/consultant.models');
const { genMeetingID } = require('../utils/id.utils');

// Utils
const { slotToStartDate, startDateToSlot } = require('../utils/timetable.utils');

const addMeeting = async (reqBody) => {
    let consultant = ConsultantModel.findOne({ id: reqBody.consultantId });
    let student = StudentModel.findOne({ id: reqBody.stuentId });
    let count = await MeetingModel.countDocuments();

    // TODO: perform valid checks

    let meetingObj = {
        id: genMeetingID(count),
        details: {
            meetingSlot: reqBody.slot,
            meetingStartTime: slotToStartDate(reqBody.year, reqBody.month, reqBody,date, reqBody.slot),
    
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
        startTimestamp: meetingObj.meetingStartTime,
        studentName: meetingObj.studentSurname+meetingObj.studentName,
        studentYear: meetingObj.studentYear,
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
        startTimestamp: meetingObj.meetingStartTime,
        studentName: meetingObj.studentSurname+meetingObj.studentName,
        studentYear: meetingObj.studentYear,
        studentItems: [],
        remark: "",
        comment: ""
    };
    student.meetings.future.push(studentMeeting);
    await student.save();
}

module.exports = { addMeeting }