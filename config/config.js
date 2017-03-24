const cfg = {
    port: 3000,
    secret: 'ENTERYOURSECRET',
    db: 'mongodb://localhost:27017/'
};

let config = require('./config_local') || cfg;

if (process.env.NODE_ENV == 'test') {
    config.db = config.db + '_test'
}

module.exports = config;
