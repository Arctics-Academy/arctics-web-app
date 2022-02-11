// App Modules
var express = require('express')
var router = express.Router()

// Controllers
const consultantController = require('../controllers/consultant.controllers')

// Routes
// returns meetings for +- 1 month
// req.body: { id: "string", date: "date" }
router.get('/meetings/calendar', async function (req, res) {
    try {
        let data = await consultantController.getConsultantMeetingsCalendar(req.body.id, req.body.date)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant calendar with id ${req.body.id}`})
    }
})

// returns all meetings
// req.body: { id: "string" }
router.get('/meetings/list', async function (req, res) {
    try {
        let data = await consultantController.getConsultantMeetingsList(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant meeting list with id ${req.body.id}`})
    }
    
})

// returns purse & all transaction records
// req.body: { id: "string" }
router.get('/purse', async function (req, res) {
    try {
        let data = await consultantController.getConsultantPurse(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant purse with id ${req.body.id}`})
    }
}) 


// return consultant.id & consultant.profile obj
// req.body: { id: "string" }
router.get('/profile', async function (req, res) {
    try {
        let data = await consultantController.getConsultantProfile(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch(e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant profile with id ${req.body.id}`})
    }
}) 


// Exports
module.exports = router