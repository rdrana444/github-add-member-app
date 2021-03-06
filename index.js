const express = require("express");
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('./config/passport')(passport);

const app = express();

const cors = require('cors');
require('dotenv').config();
require('./config/dbconnection');

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

const Admin = require('./models/Admin');
const Team = require('./models/Team');
const Story = require('./models/Story');
const Event = require('./models/Event');
const Idea = require('./models/Idea');

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/workshop', require('./routes/workshop'));
app.use('/admin', require('./routes/admin'));
app.use('/cloud-study-jam', require('./routes/studyJam'));
app.use('/api', require('./routes/api/admin_api'));
app.use('/api/v1', require('./routes/api/v1/web_api'));

app.get('*', (req, res) => {
   res.render('notfound');
});

app.listen(process.env.PORT, (err) => {
   if(err) {
       console.log("Error in running server");
       return;
   }
   console.log(`Server is up and running on http://localhost:${process.env.PORT}`);
});