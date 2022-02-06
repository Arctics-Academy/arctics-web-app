var mongoose = require('mongoose');
const { Schema } = mongoose;


subscriberSchema = new Schema({
    email: { type: String, required: true, unique: true } // unique?
}, { collection: "SubscriberForms" });
const subscriberModel = mongoose.model('subscriber', subscriberSchema);

messageSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    content: { type: String, required: true }
}, { collection: "MessageForms"});
const messageModel = mongoose.model('message', messageSchema);

earlyAccessSchema = new Schema({
    email: { type: String, required: true, index: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    school: { type: String, required: true },
    major: { type: String, required: true },
    year: { type: Number, require: true }
}, { collection: "EarlyAccessForms"})
const earlyAccessModel = mongoose.model('early-access', earlyAccessSchema);


module.exports = { subscriberModel, messageModel, earlyAccessModel };