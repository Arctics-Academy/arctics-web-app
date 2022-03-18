const express = require('express')
const router = express.Router()

const { getConsultantObject, systemValidateConsultantStudentCard, getStudentObject } = require('../controllers/system.controllers')


// Session Routes
router.get('/consultant', async (req, res) => {
    try {
        if (req.session.auth.consultantAuth) {
            let data = await getConsultantObject(req.session.auth.consultantId)
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(200).json({ status: "failed", message: "consultant session timed out"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal server error; try logging in again"})
    }
})

router.get('/student', async (req, res) => {
    try {
        if (req.session.auth.studentAuth) {
            let data = await getStudentObject(req.session.auth.studentId)
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(200).json({ status: "failed", message: "student session timed out"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal server error; try logging in again"})
    }
})


// System Action Routes
router.get('/consultant/confirm-student-id/:consultantId', async (req, res) => {
    try {
        await systemValidateConsultantStudentCard(req.params.consultantId)
        res.status(200).json({ status: "success", message: `顧問${req.params.consultantId}學生證已認證完成` })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "success", message: `資料庫有問題 請通知Sam手動認證` })
    }
})


module.exports = router