const express = require('express')
const router = express.Router()

const { ConsultantModel } = require('../models/consultant.models')

router.post('/consultant/meetings/add', async (req, res) => {
    try {
        let consultant = await ConsultantModel.findOne({ id: req.body.id })

        let timestamp = new Date()
        timestamp.setFullYear(req.body.year)
        timestamp.setMonth(req.body.month)
        timestamp.setDate(req.body.date)
        timestamp.setHours(req.body.hours)
        timestamp.setMinutes(req.body.mins)

        let meetingObj = {
            id: req.body.meetingId,
            status: (timestamp < Date().now ? "past" : "future"),
            startTimestamp: timestamp,
            studentName: req.body.studentName,
            studentYear: req.body.studentYear,
            studentItems: req.body.studentItems,
            remark: req.body.remark,
            comment: req.body.comment
        }

        if (timestamp < new Date()) {
            consultant.meetings.past.push(meetingObj)
        }
        else {
            consultant.meetings.future.push(meetingObj)
        }
        console.log(consultant)

        await consultant.save()
        res.sendStatus(200)
    }
    catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router