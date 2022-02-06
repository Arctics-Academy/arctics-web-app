var express = require('express');
var router = express.Router();

// GET/POST method to alter everything.
router.get('/');
router.post('/');

// GET processes for information display.
router.get('/dashboard', function (req, res) {}); // returns whole consultant obj
router.get('/notification', function (req, res) {}); // returns top 8 notices & top 8 notifs of consultant
router.get('/meetings', function (req, res) {}); // returns meetings for +- 1 month
router.get('/purse', function (req, res) {}); // returns top 20 transaction records
router.get('/profile', function (req, res) {}); // return everything in profile obj (resume, account settings, timetable)


module.exports = router;