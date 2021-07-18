const jwt = require('jsonwebtoken');

const validateRefresh = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        req.idInToken = decoded.id;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateRefresh;
