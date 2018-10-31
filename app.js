var express = require('express');
var app = express();
var server = app.listen(3000, () => {
    console.log('Listening');
})
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var User = require('./models/user');
var accountRoute = require('./routes/account.route')

mongoose.connect('mongodb://localhost/applypj', {useNewUrlParser: true})
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

io.on('connection', (socket) => {
    console.log(`${socket.id} just connected`);
    socket.on('Signin', data => {
        User.find({email: data.email}, (err, user) => {
            if(user == "" || user.mk != data.passwd){
                socket.emit('SigninState', true);
            }
            else{
                socket.emit('SigninState', false);
            }
        })
    })
})

app.use('/account', accountRoute);