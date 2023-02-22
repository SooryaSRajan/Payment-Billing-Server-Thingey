const mongoose = require('mongoose');

const config = require('../utils/config');
const logger  = require('../utils/logger');

function connectMongo(){
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => logger.info('Connected to MongoDB'))
        .catch((err) => logger.error(err));
}

module.exports ={
    connectMongo
}