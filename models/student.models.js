const mongoose = require('mongoose')

const { MediaSchema } = require('./system.models')

// Student schema & sub-schemas.
const StudentTransactionSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    content: { type: String, required: true },
    amount: { type: Number, required: true }
}, { _id: false })

const StudentNotificationSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String },
    read: { type: Boolean, required: true, default: false }
}, {_id: false })

const StudentAnnouncementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    read: { type: Boolean, required: true, default: false }
}, { _id: false })

const StudentMeetingSchema = new mongoose.Schema({
    id: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    startTimestamp: { type: Date, required: true },
    studentName: { type: String, required: true },
    studentYear: { type: String, required: true },
    studentItems: { type: [String], required: true, default: [] },
    remark: { type: String, required: true, default: "" },
    comment: { type: String, required: true, default: "" }
}, { _id: false })

const StudentListConsultantSchema = new mongoose.Schema({
    consultantId: { type: String, required: true },
    // 左
    photo: { type: MediaSchema },
    surname: { type: String, required: true },
    name: { type: String, required: true },
    // 中
    price: { type: Number, required: true },
    school: { type: String, required: true },
    major: { type: String, required: true },
    year: { type: String, required: true },
    // 右
    count: { type: Number, required: true },
    labels: { type: [String], required: true },
    intro: { type: String },
    // 最右
    star: { type: Number }
}, { _id: false })

const StudentSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true, select: true, unique: true },
    user: {
        email: { type: String, required: true }, // Email
        passwordEncrypted: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        otpEmail: { type: String },
        otpMobile: { type: String}
    },
    profile: {
        // 上
        surname: { type: String, required: true }, // 名字
        name: { type: String, required: true }, // 名字
        count: { type: Number, required: true, default: 0 }, // 已諮詢
        // 下
        school: { type: String, required: true }, // 就讀學系
        email: { type: String, required: true }, // 電子信箱
        emailBackup: { type: String }, // 備援信箱
        mobile: { type: String, required: true }, // 手機號碼
        mobileBackup: { type: String }, // 備援號碼
        emailVerified: { type: Boolean, required: true, default: false }, // 驗證信箱
        mobileVerified: { type: Boolean, required: true, default: false }, // 驗證號碼
        // 沒有顯示的
        year: { type: String }
    },
    list: {
        consultants: { type: [StudentListConsultantSchema], required: true, default: [] }
    },
    purse: {
        transactions: { type: [StudentTransactionSchema], required: true , default: [] }
    },
    meetings: { 
        future: { type: [StudentMeetingSchema], required: true, default: [] },
        past: { type: [StudentMeetingSchema], required: true, default: [] },
        cancelled: { type: [StudentMeetingSchema], required: true, default: [] }
    },
    announcements: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [StudentAnnouncementSchema], required: true, default: [] }
    },
    notifications: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [StudentNotificationSchema], required: true, default: [] }
    }
}, { id: false, collection: "Students" })
const StudentModel = mongoose.model('Student', StudentSchema)


module.exports = { StudentModel }