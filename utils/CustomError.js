class CustomError extends Error {
    constructor(name) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(name);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.name = name;
    }
}

module.exports = CustomError;
