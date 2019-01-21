const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const mongoose = require('mongoose');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/auth/account');
const machineRouter = require('./routes/main/machine')

app.use(express.static('public'));
app.use(express.static('views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engin', "ejs");

app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: 'userlogin',
    resave: false,
    saveUninitialized: false,
    maxage: 1000 * 60 * 30,
    cookie: null
  }));

const sessionCheck = function(req, res, next){
    if (req.session.login_id)
        next()
    else{
        console.log('out');
        res.redirect('/account/');
    }
};

app.use('/account', accountRouter);
app.use('/', sessionCheck);
app.use('/', indexRouter);
app.use('/machine', machineRouter);

// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
//app.get('/', (req, res) => res.sendFile('/views/index.html'));


io.on('connection', function(socket){
    console.log('connected');
    socket.on('addmachine', function(msg){
        console.log('success: ' + msg);
    });
});

// ポート3000でサーバを立てる
http.listen(3000, function(){
    console.log('server listening. Port:');
    //mongoose.connect('mongodb://localhost:27017/vpsapi');
});