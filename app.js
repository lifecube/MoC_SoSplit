var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var sendmoney = require('./routes/sendmoney');
var transfer = require('./routes/transfer');

var app = express();
app.locals.transfers = {};

//now we fake one transfer request data for page test
app.locals.transfers.test1 = {
  post: {
    //postId: 'postId',
    accessToken: 'aasdasd'
  },
  receiver: {
    id: 'facebookid1',
    photoUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c12.12.153.153/188271_10150159178572930_1399613_n.jpg?oh=0f41dbf67afe7d077686a01725b1b268&oe=5555D806&__gda__=1434836872_45699cae377796faf0cf77ba1dd3c720',
    display: 'display name'
  },
  requests: [
    {
      id: 'facebookid2',
      photoUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/c27.0.160.160/p160x160/29938_394627044101_2116227_n.jpg?oh=1235dcd62abfbf2dd95c0bcbcbc32c75&oe=5554E756&__gda__=1430884371_96edc87cad7ab410692f08bb25db5f46',
      display: 'display name2',
      amount: 6.5
    },
    {
      id: 'facebookid3',
      photoUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/c27.0.160.160/p160x160/29938_394627044101_2116227_n.jpg?oh=1235dcd62abfbf2dd95c0bcbcbc32c75&oe=5554E756&__gda__=1430884371_96edc87cad7ab410692f08bb25db5f46',
      display: 'display name3',
      amount: 3.5,
      sent: true
    }
  ],
  message: 'sadadad'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/send', sendmoney);
app.use('/transfers', transfer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
