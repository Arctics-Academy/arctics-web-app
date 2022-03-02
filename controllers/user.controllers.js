const PasswordUtil = require('../utils/password.utils')
const IdUtil = require('../utils/id.utils')
const { UserError, UserDoesNotExistError, DuplicateUserError, SystemError, DatabaseError, AwsSnsError, MailgunError } = require('../utils/error.utils')

const MobileUtil = require('../utils/mobile.utils')
const EmailUtil = require('../utils/email.utils')

// const StudentModel = require('../models/student')
const { ConsultantModel } = require('../models/consultant.models')


// async function checkDuplicateStudent(email) {
//     let studentData = await StudentModel.find({ 'login.email': email });
//     if (studentData.length !== 0) return true;
//     return false;
// }

const privateCheckDuplicateConsultant = async (email) => {
    if (email === "sean26857870@gmail.com") return false
    if (email === "samuelpswang@gmail.com") return false
    let consultant = await ConsultantModel.findOne({ 'user.email': email })
    if (consultant === null) return false
    return true
}

// async function registerStudent(input) {
//     if (await checkDuplicateStudent(input.login.email)) throw new Error('InputError: Duplicate student detected');
//     if (!PasswordUtil.validatePassword(input.login.password)) throw new Error('InputError: Incorrect password format');

//     let originalPassword = input.login.password;
//     let hashResult = PasswordUtil.getHashedPassword(originalPassword);
//     input.login.password = hashResult[0];
//     input.login.salt = hashResult[1];

//     let count = await StudentModel.countDocuments();
//     input.studentid = IdUtil.genUserID(count, 'ST');

//     let newStudent = new StudentModel(input);
//     await newStudent.save((err) => {
//         if(err) {
//             console.log(err);
//             throw new Error('DatabaseError: Cannot save to MongoDB');
//         }
//     });
//     return true;
// }


// expected reqBody to be
// {
//     name: string
//     school: string
//     year: string
//     email: string
//     mobile: string
//     password: string
// }
const registerConsultant = async (reqBody) => {
    // Check Duplicate Email 
    if (await privateCheckDuplicateConsultant(reqBody.email)) {
        throw new DuplicateUserError(`consultant (${reqBody.email}) already exists`)
    }

    // Setup Build
    let password = reqBody.password
    let passwordHash = PasswordUtil.getHashedPassword(password)
    let count = await ConsultantModel.countDocuments()
    
    // Build Consultant Obj
    // TODO: selecting major or field
    const consultantObj = {
        id: IdUtil.genUserID(count, 'TR'),
        user: { 
            email: reqBody.email,
            passwordEncrypted: passwordHash[0],
            passwordSalt: passwordHash[1]
        },
        profile: {
            surname: reqBody.surname,
            name: reqBody.name,
            school: reqBody.school,
            year: reqBody.year,
            email: reqBody.email,
            mobile: reqBody.mobile
        }
    }
    
    // Save To MongoDb
    let newConsultant = new ConsultantModel(consultantObj)
    try {
        await newConsultant.save()
    } 
    catch (e) {
        console.error(e)
        throw DatabaseError(`failed to save new consultant (${reqBody.email}) to MongoDB`)
    }
    delete newConsultant.user
    return newConsultant
}

// expected reqBody to be
// {
//     email: string
//     password: string
// }
// TODO: write to session object
const loginConsultant = async (reqBody) => {
    // Check whether consultant exists
    let consultant = await ConsultantModel.findOne({ 'user.email': reqBody.email })
	if (consultant === null) {
		throw new UserDoesNotExistError(`consultant (${reqBody.email}) does not exist`)
	}

    // Login Setup
    let salt = consultant.user.passwordSalt
    let hashed = PasswordUtil.matchHashPassword(reqBody.password, salt)

    // Login
    if (consultant.user.passwordEncrypted === hashed) {
        consultant = new Object(consultant)
        delete consultant.user
        return { status: "success", data: consultant }
    }
    else {
        return { status: "failed" }
    }
}

// expect reqBody { id: string }
const sendMobileOTP = async (reqBody) => {
    // Find User
    let user
    if (reqBody.id.substring(0, 2) === "TR") {
        user = await ConsultantModel.findOne({ id: reqBody.id })
    }
    if (user === undefined) {
        throw new UserDoesNotExistError(`user (${reqBody.id}) does not exist in database`)
    }
    
    // Generate Code
    let code = IdUtil.genMobileOTP()
    try {
        user.user.otpMobile = code;
        await user.save();
    }
    catch (e) {
        console.error(e);
        throw new DatabaseError(`failed to save mobile otp to user (${reqBody.id})`)
    }

    // Send SMS
    try {
        MobileUtil.sendMobileOtp(user.profile.mobile, code)
    } 
    catch (e) {
        console.error(e);
        throw new AwsSnsError(`failed to send otp to user (${user.profile.mobile})`)
    }

    return true;
}

// expect reqBody { id: string, code: string }
const matchMobileOTP = async (reqBody) => {
    // Find user
    let user
    if (reqBody.id.substring(0, 2) === "TR") {
        user = await ConsultantModel.findOne({ id: reqBody.id })
    }
    if (user === undefined) {
        throw new UserDoesNotExistError(`user (${reqBody.id}) does not exist in database`)
    }

    // Match
    let verified = false
    if (reqBody.code === user.user.otpMobile) {
        user.profile.mobileVerified = true
        verified = true
    }
    
    // Save & return status
    try {
        await user.save()
    } 
    catch (e) {
        console.error(e)
        throw new DatabaseError(`failed to save mobile verification status to user (${reqBody.id})`)
    }
    return verified
}

// expect reqBody { id: string }
const sendEmailOTP = async (reqBody) => {
    // Find user
    let user
    if (reqBody.id.substring(0, 2) === "TR") {
        user = await ConsultantModel.findOne({ id: reqBody.id })
    }
    if (user === undefined) {
        throw new UserDoesNotExistError(`user (${reqBody.id}) does not exist in database`)
    }
    
    // Generate 
    let code = IdUtil.genMobileOTP() // Replaced genEmailOTP beceause is 8-digit alphanumeric code
    try {
        user.user.otpEmail = code
        await user.save()
    } 
    catch (e) {
        console.error(e)
        throw new DatabaseError(`failed to save emal otp to user (${reqBody.id})`)
    }

    // Send email
    try {
        EmailUtil.sendEmailOtp(user, code)
    } 
    catch (e) {
        console.error(e);
        throw new MailgunError(`failed to send email otp to user (${reqBody.id})`)
    }
    return true
}

// expect reqBody { id: string, code: string }
const matchEmailOTP = async (reqBody) => {
    // Find user
    let user
    if (reqBody.id.substring(0, 2) === "TR") {
        user = await ConsultantModel.findOne({ id: reqBody.id })
    }
    if (user === undefined) {
        throw new UserDoesNotExistError(`user (${reqBody.id}) does not exist in database`)
    }

    let verified = false
    if (reqBody.code === user.user.otpEmail) {
        user.profile.emailVerified = true
        verified = true
    }
    
    try {
        await user.save()
    } catch (err) {
        console.error(err)
        throw new DatabaseError(`failed to save email verification status to user (${reqBody.id})`)
    }
    return verified
}


module.exports = {
    registerConsultant,
    loginConsultant,

    sendMobileOTP,
    matchMobileOTP,
    sendEmailOTP,
    matchEmailOTP,
}