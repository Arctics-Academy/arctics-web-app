var express = require('express');
var router = express.Router();


const consultantController = require('../controllers/consultant.controllers');

// GET/POST method to alter everything.
router.get('/');
router.post('/');

// GET processes for information display.
router.get('/dashboard', function (req, res) {}); // returns whole consultant obj
router.get('/notification', function (req, res) {}); // returns top 8 notices & top 8 notifs of consultant
router.get('/meetings', function (req, res) {}); // returns meetings for +- 1 month
router.get('/purse', function (req, res) {}); // returns top 20 transaction records

router.get('/profile', function (req, res) {
    try {
        let obj = await consultantController.getConsultantProfile(req.body.id);
        res.status(200).json({ status: "success", data: obj });
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ status: "error", message: `cannot get consultant with id ${req.body.id}`})
    }
}); // return consultant.id & consultant.profile obj


module.exports = router;