require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbURI = process.env.DATABASE_URI;

mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection to db successful');

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.json({ msg: 'This will be the homepage' });
});

app.get('/passwords', (req, res) => {
    res.json({ msg: 'Temp route for passwords' });
});

app.post('/password', (req, res) => {
    console.log(req.body);
    res.json({ msg: 'Temp route to post a password' });
});
