const mongoose = require('mongoose');

const MeetingRecordSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    description: { type: String, required: true }
}, { _id: false });

const MeetingSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true, select: true, unique: true },
    details: {
        meetingTimeslot: {type: Number, required: true }, // 諮詢時間
        fromTime: { type: Date, required: true }, // 諮詢時間
        toTime: { type: Date, required: true }, // 諮詢時間 

        studentId: { type: String, required: true }, // 對象
        teacherId: { type: String, required: true }, // ...

        labels: { type: [String], required: true, default: [] }, // 諮詢項目

        remarks: { type: String, required: true }, // 備註
        questions: { type: String, required: true }, // 問題
        conditions: { type: String, required: true } // 學習狀況簡述
    },
    order: {
        paidConsultantAmount: { type: Number, required: true, default: 200 },
        paidConsultantTime: { type: Date, required: false },
        paidConsultant: { type: Boolean, required: true, default: false }
    },
    post: {
        comment: { type: String, required: false } // 留言&回饋
    }, 
    records: { type: [MeetingRecordSchema], default: [] },
}, { _id: false, collection: 'Meetings' });
const MeetingModel = mongoose.model('Meeting', MeetingSchema);


module.exports = { MeetingModel };