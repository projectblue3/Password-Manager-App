const jwt = require('jsonwebtoken');

const validateRefresh = async (req, res, next) => {
    try {
        const token = req.headers['x-refresh-token'];

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        req.idInToken = decoded.id;
        req.tokenId = decoded.tokenId;

        console.log(decoded);

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log(error);
            return res.status(401).json({ success: false, msg: 'refresh token expired' });
        }

        next(error);
    }
};

module.exports = validateRefresh;
