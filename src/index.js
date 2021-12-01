/**
 *
 */
const path = require('path');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const route = require('./routes');
const methodOverride = require('method-override');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
const io = socketio(server);

//https://morioh.com/p/ca75996654d1


// mail.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });



dotenv.config({path: __dirname + '/.env'});

const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.use(methodOverride('_method'));

app.use(morgan('combined'));

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            processing: (value) => {
                if (!value) return 'Đang nhập liệu!';
                return 'Nhập liệu thành công!'
            }
        }
    }),
);

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resources\\views'));

io.on('connection', socket => {
    socket.on('message', (msg) => {
        io.emit('chatMessage', { msg: msg });
    });
})

route(app);

server.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = app;
