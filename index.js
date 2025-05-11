const express = require('express');
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');

const { connectDB } = require('./src/database/mdb');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/user', require('./src/routes/user.route'));
app.use('/post', require('./src/routes/post.route'));

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err) => {
    console.error("Failed to connect to database:", err);
});
