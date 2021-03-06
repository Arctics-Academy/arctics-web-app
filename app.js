var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors');
// var csurf = require('csurf');
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')

var indexRouter = require('./routes/index.routes');
var apiRouter = require('./routes/api.routes');

var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use(session({
	secret: 'arctics-platform',
	resave: true,
	saveUninitialized: true,
	cookie: { 
		maxAge: 60*(60*1000),
		httpOnly: true
	},
	store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI_SYSTEM })
}))
app.use(cors())

databaseConfig();

app.use('/api', createAuthSessionObj, apiRouter);
app.use('*', indexRouter);


async function databaseConfig() {
    try {
        await mongoose.connect(process.env.MONGODB_URI_USER);
    }
    catch(e) {
        console.error(e);
        process.exit(1);
    }
}

function createAuthSessionObj(req, res, next) { 
	if (!req.session.auth) {
		req.session.auth = {
			studentId: null,
			studentAuth: false,
			consultantId: null,
			consultantAuth: false
		}
	}
	next()
}

module.exports = app;
