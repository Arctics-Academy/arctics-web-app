// Packages
const path = require('path')
const multer = require('multer')

// Setup
const imageFileExtRegex = /\.(png|jpg|jpeg|pdf)$/


// Student Id Middleware
const studentIdStorage = multer.diskStorage({
    destination: './frontend/uploads/student-ids', 
    filename: (req, file, cb) => {
        let identifier = "StudentID" + "-" + req.body.id + "-" + Date.now() + path.extname(file.originalname);
        cb(null, identifier);
    }
})

const StudentIdUploadMiddleware = multer({
    storage: studentIdStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // in bytes...file limit 10MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(imageFileExtRegex)) {
            cb(new Error('uploaded student id is not an image'));
        }
        else {
            cb(null, true);
        }
    }
})


// Profile Photo Middleware
const profilePhotoStorage = multer.diskStorage({
    destination: './frontend/uploads/profile-photos', 
    filename: (req, file, cb) => { 
        let identifier = "ProfilePhoto" + "-" + req.body.id + "-" + Date.now() + path.extname(file.originalname);
        cb(null, identifier);
    }
})

const ProfilePhotoUploadMiddleware = multer({
    storage: profilePhotoStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // in bytes...file limit 10MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(imageFileExtRegex)) {
            cb(new Error('uploaded profile photo is not an image'));
        }
        else {
            cb(null, true);
        }
    }
})


// Meeting Payment Middleware
const meetingPaymentStorage = multer.diskStorage({
    destination: './frontend/uploads/meeting-payment', 
    filename: (req, file, cb) => { 
        let identifier = "MeetingPayment" + "-" + req.body.meetingId + "-" + Date.now() + path.extname(file.originalname);
        cb(null, identifier);
    }
})

const MeetingPaymentUploadMiddleware = multer({
    storage: meetingPaymentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // in bytes...file limit 10MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(imageFileExtRegex)) {
            cb(new Error('uploaded meeting payment is not an image'));
        }
        else {
            cb(null, true);
        }
    }
})


module.exports = 
{ 
    StudentIdUploadMiddleware,
    ProfilePhotoUploadMiddleware,
    MeetingPaymentUploadMiddleware,
}