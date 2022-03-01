const express = require('express')
const router = express.Router()

router.get('/consultant/confirm-student-id/:consultantId', async (req, res) => {
    try {
        await systemValidateConsultantStudentCard(req.params.consultantId)
        res.status(200).statusMessage(`顧問${req.params.consultantId}學生證已認證完成`)
    }
    catch (e) {
        console.error(e)
        res.status(500).statusMessage(`資料庫有問題 請通知Sam手動認證`)
    }
})

module.exports = router