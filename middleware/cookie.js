const jwt = require('jsonwebtoken');

const cookieHandler = (req, res, next) => {
    const { cookies } = req;

    console.log(cookies);

    const decoded = jwt.verify(cookies.tkn, process.env.JWT_SECRET);

    console.log(decoded);

    next();
};

module.exports = cookieHandler;
