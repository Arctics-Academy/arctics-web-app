const slotToStartDate = (year, month, date, slot) => {
    let result = new Date();
    result.setFullYear(year);
    result.setMonth((month-1+12)%12);
    result.setDate(date);
    result.setHours(Math.floor(slot/2));
    result.setMinutes(((slot % 2) === 0 ? 0 : 30));
    return result;
}

const startDateToSlot = (time) => {
    return 2*(time.getHours()) + (time.getMinutes() >= 30 ? 1 : 0);
}

const withinNextMonth = (meeting) => {
    let nextMonth = new Date(Date.now() + 1000*3600*24*30);
    console.log('withinNextMonth', meeting.startTimestamp.getTime(), nextMonth.getTime(), Date.now())
    if (meeting.startTimestamp.getTime() < nextMonth.getTime()) return true;
    else return false;
}

const unionTimetable = (consultantTable, consultantMeetings, studentMeetings) => {
    // object template
    let result = { 
        available: consultantTable,
        consultantBooked: [],
        studentBooked: []
    };

    // check consultant meetings
    for (meeting of consultantMeetings.future) {
        if (withinNextMonth(meeting)) {
            let box = [meeting.startTimestamp.getFullYear(), (meeting.startTimestamp.getMonth()+1)%12, meeting.startTimestamp.getDate(), startDateToSlot(meeting.startTimestamp)];
            result.consultantBooked.push(box);
        }
    }

    // check student meetings
    for (meeting of studentMeetings.future) {
        if (withinNextMonth(meeting)) {
            let box = [meeting.startTimestamp.getFullYear(), (meeting.startTimestamp.getMonth()+1)%12, meeting.startTimestamp.getDate(), startDateToSlot(meeting.startTimestamp)];
            result.studentBooked.push(box);
        }
    }
    
    console.log(consultantMeetings.future)
    console.log(studentMeetings.future)
    console.log(result)

    // return result
    return result;
}

module.exports = { 
    slotToStartDate,
    startDateToSlot,
    unionTimetable 
};