const express = require('express');
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());

app.use(cors());  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const Recaptcha = require('express-recaptcha').RecaptchaV3;
// const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/creator', require('./src/routes/creator.route'));
app.use('/post', require('./src/routes/post.route'));

app.listen(
    PORT,
    () => console.log(`Server running on http://localhost:${PORT}`)
);