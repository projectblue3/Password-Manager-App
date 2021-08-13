const User = require('../models/User');
const express = require('express');
const router = express.Router();
//const cookieHandler = require('../middleware/cookie');
const CustomError = require('../utils/CustomError');
const validateToken = require('../middleware/validateToken');
const validateRefresh = require('../middleware/validateRefresh');
const validateUser = require('../utils/validateUser');
const { startOfDay, endOfDay, parseISO } = require('date-fns');

//const loginCookie = 'tkn';

//Admin gets all users
router.get('/', validateToken, async (req, res, next) => {
    const sDate = req.query.sdate;
    const eDate = req.query.edate;

    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        if (user.isAdmin === true) {
            let userList = await User.find();

            //reorganize this
            if (sDate) {
                userList = await User.find({
                    dateCreated: { $gte: startOfDay(parseISO(sDate)), $lte: endOfDay(parseISO(sDate)) },
                });
            }

            if (sDate && eDate) {
                userList = await User.find({
                    dateCreated: { $gte: startOfDay(parseISO(sDate)), $lte: endOfDay(parseISO(eDate)) },
                });
            }

            res.status(200).send(userList);
        } else {
            return next(new CustomError('ForbiddenError'));
        }
    } catch (error) {
        next(error);
    }
});

//Page where a user can change settings: username, password, delete account, etc
router.get('/:username', async (req, res) => {});

//Form to create a new account
router.get('/register', async (req, res) => {});

//Form to authenticate
router.get('/login', async (req, res) => {});

//Creates new user
router.post('/register', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            isAdmin: false,
        });

        refreshToken = user.getSignedRefreshToken();

        user.refreshToken = refreshToken;

        accessToken = user.getSignedJwtToken();

        await user.save();

        res.status(200).json({ success: true, msg: 'Account created', accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
});

//Authenticates account
router.post('/login', async (req, res, next) => {
    //const { cookies } = req;

    //clear login cookie for new register
    // if (cookies[loginCookie]) {
    //     res.clearCookie(loginCookie);
    // }

    try {
        const userPass = await User.findOne({ username: req.body.username }).select('password');

        if (!userPass) {
            return next(new CustomError('UserNotFoundError'));
        } else {
            if (await userPass.matchPassword(req.body.password)) {
                // res.cookie(loginCookie, user.getSignedJwtToken(), { httpOnly: true, secure: true });

                const user = await User.findOne({ username: req.body.username });

                if (!user) {
                    return next(new CustomError('UserNotFoundError'));
                }

                refreshToken = user.getSignedRefreshToken();

                user.refreshToken = refreshToken;

                accessToken = user.getSignedJwtToken();

                await user.save();

                res.json({ success: true, msg: 'logged in', accessToken, refreshToken });
            } else {
                return next(new CustomError('IncorrectPasswordError'));
            }
        }
    } catch (error) {
        next(error);
    }
});

//Updates username
router.patch('/:id/setusername', validateToken, async (req, res, next) => {
    try {
        const user = await validateUser(req.params.id, req.idInToken, next);
        if (user) {
            user.username = req.body.username;

            await user.save();

            res.status(200).json({ success: true, msg: 'Username updated' });
        }
    } catch (error) {
        next(error);
    }
});

//Updates email
router.patch('/:id/setemail', validateToken, async (req, res, next) => {
    try {
        const user = await validateUser(req.params.id, req.idInToken, next);
        if (user) {
            user.email = req.body.email;

            await user.save();

            res.status(200).json({ success: true, msg: 'Email updated' });
        }
    } catch (error) {
        next(error);
    }
});

//Updates password
router.patch('/:id/setpassword', validateToken, async (req, res, next) => {
    try {
        const user = await validateUser(req.params.id, req.idInToken, next);

        if (user) {
            user.password = req.body.password;

            refreshToken = user.getSignedRefreshToken();

            user.refreshToken = refreshToken;

            accessToken = user.getSignedJwtToken();

            await user.save();

            res.status(200).json({ success: true, msg: 'Password updated', accessToken, refreshToken });
        }
    } catch (error) {
        next(error);
    }
});

//Logout
router.post('/:id/logout', validateRefresh, async (req, res, next) => {
    try {
        const user = await validateUser(req.params.id, req.idInToken, next);

        if (user) {
            user.refreshToken = '';

            await user.save();

            res.status(204).json({ success: true, msg: 'User logged out' });
        }
    } catch (error) {
        next(error);
    }
});

/*
//Deletes account
router.delete('/:username/delete', (req, res) => {
    User.findOneAndDelete({ username: req.params.username })
        .then((user) => {
            if (user) {
                return res.status(200).json({ msg: 'User deleted' });
            } else {
                return res.status(400).json({ msg: 'User does not exist' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong' });
        });
});
*/

module.exports = router;
