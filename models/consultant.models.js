const mongoose = require('mongoose')

const { MediaSchema } = require('./system.models')


// Consultant schema & sub-schemas.
const ConsultantTransactionSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    content: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    withdrawn: { type: Number, required: true }
}, { _id: false })

const ConsultantNotificationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String },
    read: { type: Boolean, required: true, default: false }
}, {_id: false })

const ConsultantAnnouncementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    read: { type: Boolean, required: true, default: false }
}, { _id: false })

const ConsultantMeetingSchema = new mongoose.Schema({
    id: { type: String, required: true },
    status: { type: String, required: true, default: "future" },
    startTimestamp: { type: Date, required: true },
    studentName: { type: String, required: true },
    studentYear: { type: String, required: true },
    studentItems: { type: [String], required: true, default: [] },
    remark: { type: String, required: true, default: "" },
    comment: { type: String, required: true, default: "" }
}, { _id: false })

const ConsultantBankSchema = new mongoose.Schema({
    default: { type: Boolean, required: true, default: false },
    usage: { type: String },
    bankNo: { type: String, required: true },
    accountNo: { type: String, required: true }
}, { _id: false })

const ConsultantSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true, select: true, unique: true },
    user: {
        email: { type: String, required: true }, // Email
        passwordEncrypted: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        otpEmail: { type: String },
        otpMobile: { type: String}
    },
    profile: {
        // ????????????-???
        photo: { type: MediaSchema },
        surname: { type: String, required: true }, // ??????
        name: { type: String, required: true }, // ??????
        count: { type: Number, required: true, default: 0 }, // ?????????
        star: { type: Number }, // ??????

        // ????????????
        price: { type: Number, required: true, default: 200 }, // ??????
        school: { type: String, required: true }, // ??????&??????
        major: { type: String }, // ??????&??????
        year: { type: String, required: true }, // ??????&??????
        field: { type: [String], required: true, default: [] }, // ??????
        labels: { type: [String], required: true, default: [] }, // ????????????
        experiences: { type: String }, // ????????????&????????????
        intro: { type: String }, // ????????????

        // ???????????? (????????????)
        email: { type: String, required: true }, // ????????????
        emailBackup: { type: String }, // ????????????
        mobile: { type: String, required: true }, // ????????????
        mobileBackup: { type: String }, // ????????????

        // ?????????
        timetable: { type: [[Number], [Number], [Number], [Number], [Number], [Number], [Number]], required: true, default: [[], [], [], [], [], [], []] },

        // ????????????????????????
        minor: { type: String }, // ?????????&??????
        emailVerified: { type: Boolean, required: true, default: false }, // ????????????
        mobileVerified: { type: Boolean, required: true, default: false }, // ????????????
        studentCard: { type: MediaSchema }, // ???????????????
        studentCardVerified: { type: Boolean, required: true, default: false }, // ???????????????
    },
    purse: {
        balance: { type: Number, required: true, default: 0 },
        withdrawn: { type: Number, required: true, default: 0 },
        transactions: { type: [ConsultantTransactionSchema], required: true , default: [] },
        bankList: { type: [ConsultantBankSchema], required: true, default: [] }
    },
    meetings: { 
        future: { type: [ConsultantMeetingSchema], required: true, default: [] },
        past: { type: [ConsultantMeetingSchema], required: true, default: [] },
        cancelled: { type: [ConsultantMeetingSchema], required: true, default: [] }

    },
    announcements: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [ConsultantAnnouncementSchema], required: true, default: [] }
    },
    notifications: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [ConsultantNotificationSchema], required: true, default: [] }
    }
}, { id: false, collection: "Consultants" })
const ConsultantModel = mongoose.model('Consultant', ConsultantSchema)


module.exports = { ConsultantModel }