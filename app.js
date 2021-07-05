require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

//Set view
app.set('view engine', 'ejs');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use(function (req, res, next) {
    const passRegex = /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])/;
    const password = req.body.password;
    const passMax = 32;
    const passMin = 8;

    if (password) {
        if (!passRegex.test(password)) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        if (password.length < passMin) {
            return res.status(400).json({ msg: 'Password Too Short: Must be 8 - 32 Characters' });
        }

        if (password.length > passMax) {
            return res.status(400).json({ msg: 'Password Too Long: Must be 8 - 32 Characters' });
        }
    }

    next();
});

//Dotenv variables
const PORT = process.env.PORT || 3000;
const dbURI = process.env.DATABASE_URI;

//Routes
app.use('/api/passwords', require('./routes/passwords'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));

//Mongoose deprecation settings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Connect to db then start server
mongoose
    .connect(dbURI)
    .then(() => {
        console.log('Connection to db successful');

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

//Homepage Route
app.get('/', (req, res) => {
    res.json({ msg: 'This will be the homepage' });
});
