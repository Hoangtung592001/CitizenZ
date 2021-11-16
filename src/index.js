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
const app = express();
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const dotenv = require('dotenv');

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

route(app);

server.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = app;




