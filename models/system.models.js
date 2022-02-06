const mongoose = require('mongoose');


const MediaSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
    data: { type: String, required: true }
}, { _id: false });


module.exports = { MediaSchema };


// // Announcement Schema (useful later)
// const ConsultantAnnouncementSchema = new Schema({
//     id: { type: String, required: true },
//     html: { type: String, required: true },
//     media: { type: [{
//         type: { type: String },
//         data: { type: String }
//     }], required: true, default: [] }
// });