require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const app = express();

//Set view
app.set('view engine', 'ejs');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));

//Dotenv variables
const PORT = process.env.PORT || 3000;
const dbURI = process.env.DATABASE_URI;

//Routes
app.use('/', require('./routes/home'));
app.use('/api/passwords', require('./routes/passwords'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('*', require('./routes/pageNotFound'));

//Error handler
app.use(errorHandler);

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
