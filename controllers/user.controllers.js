const PasswordUtil = require('../utils/password.utils')
const IdUtil = require('../utils/id.utils')
const { UserError, UserDoesNotExistError, DuplicateUserError, SystemError, DatabaseError, AwsSnsError, MailgunError } = require('../utils/error.utils')

const MobileUtil = require('../utils/mobile.utils')
const EmailUtil = require('../utils/email.utils')

const { ConsultantModel } = require('../models/consultant.models')
const { StudentModel } = require('../models/student.models')


const privateCheckDuplicateStudent = async (email) => {
    if (email === "sean26857870@gmail.com") return false
    if (email === "samuelpswang@gmail.com") return false
    let studentData = await StudentModel.find({ 'user.email': email })
    if (studentData.length !== 0) return true
    return false
}

const privateCheckDuplicateConsultant = async (email) => {
    if (email === "sean26857870@gmail.com") return false
    if (email === "samuelpswang@gmail.com") return false
    let consultant = await ConsultantModel.findOne({ 'user.email': email })
    if (consultant === null) return false
    return true
}

// expected reqBody to be
// {
//     surname: string
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

    // Send Welcome Message
    EmailUtil.sendConsultantWelcomeEmail(consultantObj);

    newConsultant.user = null
    return newConsultant
}

// expected reqBody to be
// {
//     email: string
//     password: string
// }
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
        consultant.user = null
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
    if (reqBody.id.substring(0, 2) === "ST") {
        user = await StudentModel.findOne({ id: reqBody.id })
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
    if (reqBody.id.substring(0, 2) === "ST") {
        user = await StudentModel.findOne({ id: reqBody.id })
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
    if (reqBody.id.substring(0, 2) === "ST") {
        user = await StudentModel.findOne({ id: reqBody.id })
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
    if (reqBody.id.substring(0, 2) === "ST") {
        user = await StudentModel.findOne({ id: reqBody.id })
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


// expected reqBody to be
// {
//     surname: string
//     name: string
//     school: string
//     year: string
//     email: string
//     mobile: string
//     password: string
// }
const registerStudent = async (reqBody) => {
    // Check Duplicate Email 
    if (await privateCheckDuplicateStudent(reqBody.email)) {
        throw new DuplicateUserError(`student (${reqBody.email}) already exists`)
    }

    // Setup Build
    let password = reqBody.password
    let passwordHash = PasswordUtil.getHashedPassword(password)
    let count = await StudentModel.countDocuments()
    
    // Build Student Obj
    const studentObj = {
        id: IdUtil.genUserID(count, 'ST'),
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
    let newStudent = new StudentModel(studentObj)
    try {
        await newStudent.save()
    } 
    catch (e) {
        console.error(e)
        throw DatabaseError(`failed to save new consultant (${reqBody.email}) to MongoDB`)
    }
    newStudent.user = null
    return newStudent
}

// expected reqBody to be
// {
//     email: string
//     password: string
// }
const loginStudent = async (reqBody) => {
    // Check whether student exists
    let student = await StudentModel.findOne({ 'user.email': reqBody.email })
	if (student === null) {
		throw new UserDoesNotExistError(`student (${reqBody.email}) does not exist`)
	}

    // Login Setup
    let salt = student.user.passwordSalt
    let hashed = PasswordUtil.matchHashPassword(reqBody.password, salt)

    // Login
    if (student.user.passwordEncrypted === hashed) {
        student = new Object(student)
        student.user = null
        return { status: "success", data: student }
    }
    else {
        return { status: "failed" }
    }
}

// patch: fix later
const sendPasswordResetOtp = async (reqBody) => {
    if (reqBody.identity === 'consultant') {
        let consultant = await ConsultantModel.findOne({ 'user.email': reqBody.email });
        if (!consultant) return { status: 'failed', message: `consultant (${reqBody.email}) not found`, code: 0 };

        let code = IdUtil.genMobileOTP();
        consultant.user.otpEmail = code;
        await consultant.save();
        EmailUtil.sendEmailOtp(consultant, code);
        return { status: 'success', message: `consultant (${reqBody.email}) otp email sent` };
    }
    else if (reqBody.identity === 'student') {
        let student = await StudentModel.findOne({ 'user.email': reqBody.email });
        if (!student) return { status: 'failed', message: `student (${reqBody.email}) not found`, code: 0 };

        let code = IdUtil.genMobileOTP();
        student.user.otpEmail = code;
        await student.save();
        EmailUtil.sendEmailOtp(student, code);
        return { status: 'success', message: `student (${reqBody.email}) otp email sent` };
    }
    else {
        return { status: 'failed', message: `request parameters error`, code: 2 };
    }
}

// patch: fix later
const matchPasswordResetOtp = async (reqBody) => {
    if (reqBody.identity === 'consultant') {
        let consultant = await ConsultantModel.findOne({ 'user.email': reqBody.email });
        if (!consultant) return { status: 'failed', message: `consultant (${reqBody.email}) not found`, code: 0 };

        if (reqBody.code === consultant.user.otpEmail) {
            let password = reqBody.password;
            let passwordHash = PasswordUtil.getHashedPassword(password);
            consultant.user.passwordEncrypted = passwordHash[0];
            consultant.user.passwordSalt = passwordHash[1];
            await consultant.save();
            return { status: 'success', message: `consultant (${reqBody.email}) password reset` };
        }
        else {
            return { status: 'failed', message: `email otp incorrect`, code: 1 };
        }
    }
    else if (reqBody.identity === 'student') {
        let student = await StudentModel.findOne({ 'user.email': reqBody.email });
        if (!student) return { status: 'failed', message: `student (${reqBody.email}) not found`, code: 0 };

        if (reqBody.code === student.user.otpEmail) {
            let password = reqBody.password;
            let passwordHash = PasswordUtil.getHashedPassword(password);
            student.user.passwordEncrypted = passwordHash[0];
            student.user.passwordSalt = passwordHash[1];
            await student.save();
            return { status: 'success', message: `student (${reqBody.email}) password reset` };
        }
        else {
            return { status: 'failed', message: `email otp incorrect`, code: 1 };
        }
    }
    else {
        return { status: 'failed', message: `request parameters error`, code: 2 };
    }
}


module.exports = {
    registerConsultant,
    loginConsultant,

    registerStudent,
    loginStudent,

    sendMobileOTP,
    matchMobileOTP,
    sendEmailOTP,
    matchEmailOTP,

    sendPasswordResetOtp,
    matchPasswordResetOtp
}