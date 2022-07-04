const mongoose = require('mongoose');

const { MediaSchema } = require('./system.models');

const MeetingRecordSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    description: { type: String, required: true }
}, { _id: false });

const MeetingSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true, select: true, unique: true },
    details: {
        meetingSlot: { type: Number, required: true },
        meetingStartTime: { type: Date, required: true },

        studentId: { type: String, required: true },
        studentSurname: { type: String, required: true },
        studentName: { type: String, required: true },
        studentSchool: { type: String },
        studentYear: { type: String, required: true },
        
        consultantId: { type: String, required: true },
        consultantSurname: { type: String, required: true },
        consultantName: { type: String, required: true },
        consultantSchool: { type: String, required: true },
        consultantMajor: { type: String, required: true },
        consultantYear: { type: String, required: true },
        consultantPrice: { type: Number, required: true },

        remarks: { type: String }, // 備註
        questions: { type: String }, // 問題
        conditions: { type: String } // 學習狀況簡述
    },
    order: {
        confirmed: { type: Boolean, required: true, default: false },
        discount: { type: String },
        
        submitted: { type: Boolean, required: true, default: false },
        submittedTimestamp: { type: Date },
        
        paymentAmount: { type: Number },
        paymentAccountName: { type: String },
        paymentDate: { type: String },
        paymentReceipt: { type: MediaSchema }
    },
    post: {
        comment: { type: String, required: false } // 留言&回饋
    }, 
    records: { type: [MeetingRecordSchema], default: [] },
}, { id: false, collection: 'Meetings' });
const MeetingModel = mongoose.model('Meeting', MeetingSchema);


module.exports = { MeetingModel };