var express = require('express');
var router = express.Router();

var { subscriberModel, messageModel, earlyAccessModel } = require('../models/demo.models');


router.post('/subscriber-form', async function(req, res) {
    try {
        let data = { timestamp: new Date(), email: req.body.email };
        let newSubscriber = new subscriberModel(data);
        await newSubscriber.save();
        res.status(200).json({ status: "success", message: "subscriber added" });
    }
    catch(e) {
        if (e.name === 'MongoServerError' && e.code === 11000) {
            res.status(200).json({ status: "success", message: "subscriber already in database" });
        }
        else {
            console.error(e);
            res.status(500).json({ status: "error", message: "subscriber form parse failure" });
        }
    }
});

router.post('/message-form', async function(req, res) {
    try {
        let data = { 
            timestamp: new Date(),
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

// var { early_access_email } = require('../utils/email.utils')
// router.post('/early-access', async function(req, res) {
//     try {
//         let data = req.body.form;
//         data.timestamp = new Date();
// 
//         let newEarlyAccess = new earlyAccessModel(data);
//         await newEarlyAccess.save();
//         await early_access_email(data);
//         res.status(200).json({ status: "success", message: "early access data saved and early access email sent" });
//     }
//     catch(e) {
//         console.error(e);
//         res.status(500).json({ status: "error", message: "early acesss form parse failure or email sent failure" });
//     }
// });

module.exports = router;