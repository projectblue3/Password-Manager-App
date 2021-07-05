const User = require('../models/User');
const express = require('express');
const router = express.Router();

const { startOfDay, endOfDay, parseISO } = require('date-fns');
const bcrypt = require('bcrypt');
const { findOne } = require('../models/User');

const saltRounds = 10;

//Admin gets all users
router.get('/', async (req, res) => {
    const sDate = req.query.sdate;
    const eDate = req.query.edate;

    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Page where a user can change settings: username, password, delete account, etc
router.get('/:username', async (req, res) => {});

//Form to create a new account
router.get('/register', async (req, res) => {});

//Form to authenticate
router.get('/login', async (req, res) => {});

//Creates new user
router.post('/register', async (req, res) => {
    try {
        const hPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hPassword,
        });

        await user.save();
        res.status(200).json({ msg: 'Account created' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Authenticates account
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        } else {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.json({ msg: 'logged in' });
            } else {
                res.json({ msg: 'incorrect password: access denied' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Updates username
router.patch('/:username/setusername', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { username: req.body.username },
            { runValidators: true }
        );

        if (user) {
            return res.status(200).json({ msg: 'User updated' });
        } else {
            return res.status(400).json({ msg: 'User does not exist' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }

        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Updates email
router.patch('/:username/setemail', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { email: req.body.email },
            { runValidators: true }
        );

        if (user) {
            return res.status(200).json({ msg: 'User updated' });
        } else {
            return res.status(400).json({ msg: 'User does not exist' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }

        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Updates password
router.patch('/:username/setpassword', async (req, res) => {
    try {
        const hPassword = req.body.password;

        //handle this error
        if (req.body.password) {
            hPassword = await bcrypt.hash(req.body.password, saltRounds);
        }

        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { password: hPassword },
            { runValidators: true }
        );

        if (user) {
            return res.status(200).json({ msg: 'User updated' });
        } else {
            return res.status(400).json({ msg: 'User does not exist' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }

        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

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

module.exports = router;
