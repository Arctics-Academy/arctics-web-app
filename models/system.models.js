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
const AnnouncementModel = new mongoose.model('Announcements', AnnouncementSchema);

const DiscountCodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    code: { type: String, required: true },
    
    title: { type: String, required: true },
    description: { type: String },
    
    method: { type: String, required: true },
    number: { type: String, required: true },

    addedTimestamp: { type: Date, required: true },
    expiredTimestamp: { type: String, required: true },

    userExclusive: { type: Boolean, required: true, default: false },
    userAllowed: { type: [String], required: true, default: [] }
}, { _id: false, collection: 'Announcements' });
const DiscountCodeModel = new mongoose.model('DiscountCodes', DiscountCodeSchema);


module.exports = { MediaSchema, AnnouncementModel, DiscountCodeModel };