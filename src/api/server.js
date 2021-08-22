const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

//  URI: Mongo
mongoose.connect('mongodb://localhost:27017/Cookmaster');