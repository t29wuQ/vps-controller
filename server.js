const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/auth/account');

app.use(bodyParser());

app.use(express.static('public'));
app.use(express.static('views'));

app.use('/', indexRouter);
app.use('/account', accountRouter)

// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', (req, res) => res.sendFile('/views/index.html'));


io.on('connection', function(socket){
    console.log('connected');
    socket.on('addmachine', function(msg){
        console.log('success: ' + msg);
    });
});

// ポート3000でサーバを立てる
http.listen(3000, function(){
    console.log('server listening. Port:');
    mongoose.connect('mongodb://mongodb/vpsapi');
});