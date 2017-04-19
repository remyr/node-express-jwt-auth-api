let DB_PORT;
if(process.env.DB_PORT) {
    DB_PORT = process.env.DB_PORT.replace('tcp', 'mongodb');
} else {
    DB_PORT = 'mongodb://localhost:27017'
}

let cfg = {
    port: process.env.PORT || 3000,
    secret: 'SECRETKEY',
    // db: 'mongodb://localhost:27017/wa_domotique'
    db: `${DB_PORT}/node-express`
};

let config = require('./config_local') || cfg;

if (process.env.NODE_ENV === 'test') {
    config.db = config.db + '_test'
}

module.exports = config;
