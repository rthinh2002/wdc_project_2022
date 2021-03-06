var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mysql = require('mysql2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var adminRouter = require('./routes/admin');
var commsRouter = require('./routes/comms');

var app = express();

// Create pool connection for database
var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'event_planning',
    typeCast: function castField( field, useDefaultTypeCasting ) { // This field is for casting BIT into boolean data - Peter
		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
			var bytes = field.buffer();
			return( bytes[ 0 ] === 1 );
		}
		return( useDefaultTypeCasting() );
	},
    multipleStatements: true
});

// Database connection
app.use(function(req, res, next)
{
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'gnirtstercesasisiht',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// check user is logged in; only admins and users permitted to access app pages
// guests are redirect to guest_invitation page
app.use('/app', (req, res, next) => {
    if (!('user_id' in req.session)) {
        res.redirect('/login.html');
    } else if ( ('user_id' in req.session) && req.session.user_role === 'guest') {
        if ('event_id' in req.session) {
            res.redirect('/guest_invitation.html?e_id=' + req.session.event_id);
        } else {
            res.redirect('/login.html');
        }
    }
    next();
});

// check user is authorised to access admin page
app.use('/admin.html', (req, res, next) => {
    console.log('Attempted access to admin');
    if (!('user_role' in req.session) || (req.session.user_role !== 'admin')) {
        res.sendStatus(403);
    } else {
    next();
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/admin', adminRouter);
app.use('/comms', commsRouter);

module.exports = app;
