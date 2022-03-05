const mongoose = require('mongoose');


const MediaSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
    data: { type: Buffer, required: true }
}, { _id: false });

const AnnouncementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    media: { type: [MediaSchema], required: true, default: [] }
}, { _id: false, collection: 'Announcements' });
const AnnouncementModel = new mongoose.model('Announcement', AnnouncementSchema);


module.exports = { MediaSchema, AnnouncementModel };