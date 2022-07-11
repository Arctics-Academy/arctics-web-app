// User Errors
class UserError extends Error {
    constructor(message) {
        super()
        this.name = "UserError"
        this.message = message
    }
}

class UserDoesNotExistError extends UserError {
    constructor(message) {
        super()
        this.name = "UserDoesNotExistError"
        this.message = message
    }
}

class DuplicateUserError extends UserError {
    constructor(message) {
        super()
        this.name = "DuplicateUserError"
        this.message = message
    }
}

// Meeting Errors
class MeetingError extends Error {
    constructor(message) {
        super()
        this.name = "MeetingError"
        this.message = message
    }
}

class MeetingDoesNotExistError extends MeetingError {
    constructor(message) {
        super()
        this.name = "MeetingDoesNotExistError"
        this.message = message
    }
}

// Email Errors
class EmailGenerationError extends Error {
    constructor(message) {
        super()
        this.name = "EmailGenerationError"
        this.message = message
    }
}

class EmptySubjectError extends EmailGenerationError {
    constructor(message) {
        super()
        this.name = "EmptySubjectError"
        this.message = message
    }
}

class EmptyContentError extends EmailGenerationError {
    constructor(message) {
        super()
        this.name = "EmptyContentError"
        this.message = message
    }
}

class TemplateObjectError extends EmailGenerationError {
    constructor(message) {
        super()
        this.name = "EmptySubjectError"
        this.message = message
    }
}

// System Error
class SystemError extends Error {
    constructor(message) {
        super()
        this.name = "SystemError"
        this.message = message
    }
}

class DatabaseError extends SystemError {
    constructor(message) {
        super()
        this.name = "DatabaseError"
        this.message = message
    }
}

class AwsSnsError extends SystemError {
    constructor(message) {
        super()
        this.name = "AwsSnsError"
        this.message = message
    }
}

class MailgunError extends SystemError {
    constructor(message) {
        super()
        this.name = "MailgunError"
        this.message = message
    }
}

class FileNotFoundError extends SystemError {
    constructor(message) {
        super()
        this.name = "FileNotFoundError"
        this.message = message
    }
}


// Error Exports
module.exports = 
{
    UserError,
    UserDoesNotExistError,
    DuplicateUserError,

    MeetingError,
    MeetingDoesNotExistError,

    EmailGenerationError,
    EmptySubjectError,
    EmptyContentError,
    TemplateObjectError,

    SystemError,
    DatabaseError,
    AwsSnsError,
    MailgunError,
    FileNotFoundError,
}
  