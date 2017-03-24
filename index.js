let server = require('./server/server');
let config = require('./config/config');
let mongoose = require('mongoose');

mongoose.connect(config.db);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('==> Connected to database');
});

server.listen(config.port, (err) => {
    if (err) throw err;
    console.log('==> Server running on port ' + config.port)
});