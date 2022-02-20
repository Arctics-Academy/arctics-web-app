// Packages
const path = require('path')
const multer = require('multer')

// Setup
const imageFileExtRegex = /\.(png|jpg|jpeg|pdf)$/


// Student Id Middleware
const studentIdStorage = multer.diskStorage({
    destination: './frontend/uploads/student-ids', 
    filename: (req, file, cb) => { cb(null, `StudentID-${req.id}-${path.extname(file.originalname)}`) }
})

const StudentIdUploadMiddleware = multer({
    storage: studentIdStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // in bytes...file limit 10MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(imageFileExtRegex)) {
            return cb(new Error('uploaded student id is not an image'));
        }
        else {
            cb(null, true)
        }
    }
})


// Profile Photo Middleware
const profilePhotoStorage = multer.diskStorage({
    destination: './frontend/uploads/profile-photos', 
    filename: (req, file, cb) => { cb(null, `ProfilePhoto-${req.id}-${path.extname(file.originalname)}`) }
})

const ProfilePhotoUploadMiddleware = multer({
    storage: profilePhotoStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // in bytes...file limit 10MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(imageFileExtRegex)) {
            return cb(new Error('uploaded profile photo is not an image'));
        }
        else {
            cb(null, true)
        }
    }
})


module.exports = 
{ 
    StudentIdUploadMiddleware,
    ProfilePhotoUploadMiddleware,
}