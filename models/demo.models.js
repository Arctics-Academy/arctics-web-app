var mongoose = require('mongoose');
const { Schema } = mongoose;


subscriberSchema = new Schema({
    timestamp: { type: Date, required: true },
    email: { type: String, required: true, unique: true }
}, { collection: 'SubscriberForms' });
const subscriberModel = mongoose.model('SubscriberForm', subscriberSchema);

messageSchema = new Schema({
    timestamp: { type: Date, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    content: { type: String, required: true }
}, { collection: 'MessageForms' });
const messageModel = mongoose.model('MessageForm', messageSchema);

earlyAccessSchema = new Schema({
    timestamp: { type: Date, required: true },
    email: { type: String, required: true, index: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    school: { type: String, required: true },
    major: { type: String, required: true },
    year: { type: Number, require: true }
}, { collection: 'EarlyAccesForms' });
const earlyAccessModel = mongoose.model('EarlyAccesForms', earlyAccessSchema);


module.exports = { subscriberModel, messageModel, earlyAccessModel };