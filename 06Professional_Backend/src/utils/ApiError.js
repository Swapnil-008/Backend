class ApiError extends Error {
    constructor(message = "Something went wrong!", statusCode, errors = [], statck = "")
    {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.message = message;
        this.success = false
        if (statck)
        {
            this.stack = statck
        }
        else {
            Error.captureStackTrace(this, this.constructor())
        }
    }
}

export {ApiError}