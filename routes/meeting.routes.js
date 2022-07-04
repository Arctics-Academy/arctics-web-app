var express = require('express');
var path = require('path');

var router = express.Router();

const { addMeeting } = require('../controllers/meeting.controllers');

router.post('/add', async (req, res) => {
    // req.body
    // {
    //     consultantId: "string",
    //     studentId: "string",
    //     year: number,
    //     month: number,
    //     date: number,
    //     slot: number,
    // }
    try {
        let meeting = await addMeeting(req.body);
        res.status(200).json({ status: "success", message: `meeting ${meeting.id} successfully created`});

        // TODO: add discount
        // TODO: add email & notifications
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `uncaught server error when creating meeting` })
    }
});

// TODO: add update meeting

// TODO: add cancel meeting

module.exports = router;