var express = require('express')
var router = express.Router()


const consultantController = require('../controllers/consultant.controllers')

// GET/POST method to alter everything.
router.get('/')
router.post('/')
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


// GET processes for information display.
router.get('/dashboard', function (req, res) {}); // returns whole consultant obj
router.get('/notification', function (req, res) {}); // returns top 8 notices & top 8 notifs of consultant
router.get('/purse', function (req, res) {}); // returns top 20 transaction records

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


module.exports = router