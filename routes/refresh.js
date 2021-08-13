const User = require('../models/User');
const express = require('express');
const router = express.Router();
const CustomError = require('../utils/CustomError');
const validateRefresh = require('../middleware/validateRefresh');
const jwt = require('jsonwebtoken');

router.post('/', validateRefresh, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        const decodedDbToken = jwt.verify(user.refreshToken, process.env.JWT_REFRESH_SECRET);

        console.log(req.tokenId, ' ', decodedDbToken.tokenId);

        if (!req.tokenId === decodedDbToken.tokenId) {
            return next(new CustomError('ForbiddenError'));
        }

        accessToken = user.getSignedJwtToken();

        res.json({ success: true, msg: 'Authenticated', accessToken });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
