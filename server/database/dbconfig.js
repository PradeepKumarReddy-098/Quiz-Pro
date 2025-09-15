const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = db;