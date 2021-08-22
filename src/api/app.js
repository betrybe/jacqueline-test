const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', require('./users/router'));

module.exports = app;
