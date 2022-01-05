var express = require('express');
var router = express.Router();

var { subscriberModel, messageModel } = require('../models/demo.models');


router.post('/subscriber-form', async function(req, res) {
    try {
        let data = { email: req.body.email };
        let newSubscriber = new subscriberModel(data);
        await newSubscriber.save();
        res.status(200).json({ status: "success", message: "subscriber added" });
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ status: "error", message: "subscriber form parse failure" });
    }
});

router.post('/message-form', async function(req, res) {
    try {
        let data = { 
            name: req.body.form.name,
            contact: req.body.form.phone,
            content: req.body.form.message
        }
        let newMessage = new messageModel(data);
        await newMessage.save();
        res.status(200).json({ status: "success", message: "message contents saved" });
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ status: "error", message: "message form parse failure" });
    }
});


module.exports = router;