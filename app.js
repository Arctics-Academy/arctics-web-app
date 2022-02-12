var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors');
var csurf = require('csurf');
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

app.use(cors());
app.use(csurf({ cookie: true }))

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
