const CustomError = require('../utils/CustomError');

const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        const message = `Duplicate Field value entered`;
        return res.status(400).json({ success: false, msg: message, value: err.keyValue });
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({ success: false, msg: message });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, msg: err.message });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, msg: err.message });
    }

    if (err.name === 'PasswordNotFoundError') {
        const message = `Password could not be found`;
        return res.status(404).json({ success: false, msg: message });
    }

    if (err.name === 'UserNotFoundError') {
        const message = `User could not be found`;
        return res.status(404).json({ success: false, msg: message });
    }

    if (err.name === 'SyntaxError') {
        return res.status(400).json({ success: false, msg: err.message });
    }

    if (err.name === 'ForbiddenError') {
        const message = `Forbidden`;
        return res.status(403).json({ success: false, msg: message });
    }

    if (err.name === 'IncorrectPasswordError') {
        const message = `incorrect password`;
        return res.status(401).json({ success: false, msg: message });
    }

    console.log(err);

    res.status(500).json({
        success: false,
        msg: err.message || 'Server Error',
    });
};

module.exports = errorHandler;
