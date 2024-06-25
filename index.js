const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./models');
const emailServer = require('./email');
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json({
	limit: '50MB'
}));

app.use(cors());

const production = true;

require('./routes')(app, models, express, emailServer, production);
require('./socket-events')(io, models);

var port;

production
? port = 80
: port = 3000;

http.listen(port);
