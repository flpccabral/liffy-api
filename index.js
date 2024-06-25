const express = require('express');
const app = express();
const http = require('http').Server(app); // Cria um servidor HTTP com Express
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./models');
const emailServer = require('./email');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8000", // Especifique o domínio de origem aqui
        methods: ["GET", "POST"],
        credentials: true, // Habilita o suporte a credenciais
        allowEIO3: false
    }
});

app.use(bodyParser.json({
    limit: '50MB'
}));

app.use(cors());

const production = true;

require('./routes')(app, models, express, emailServer, production);
require('./socket-events')(io, models);

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

var port = production ? 80 : 3000; // Simplificação da atribuição de porta

http.listen(port, () => { // Alterado para usar o servidor HTTP para escutar na porta especificada
    console.log(`Server running on port ${port}`);
});