var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index.routes');
var apiRouter = require('./routes/api.routes');

var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

const cors_whitelist = [ 'https://arctics.academy', 'https://www.arctics.academy' ];
const cors_options = {
    origin: (origin, callback) => {
        if (cors_whitelist.indexOf[origin] !== -1) callback(true, null);
        else new Error('not allowed by cors');
    }
}
app.options('*', cors(cors_options));

databaseConfig();

app.use('/api', apiRouter);
app.use('*', indexRouter);


async function databaseConfig() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(e) {
        console.error(e);
        process.exit(1);
    }
}

module.exports = app;
