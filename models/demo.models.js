var mongoose = require('mongoose');
const { Schema } = mongoose;


subscriberSchema = new Schema({
    email: { type: String, required: true }
});
const subscriberModel = mongoose.model('subscriber', subscriberSchema);

messageSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    content: { type: String, required: true }
});
const messageModel = mongoose.model('message', messageSchema);


module.exports = { subscriberModel, messageModel };