const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v4ofevg.mongodb.net/${process.env.DB_NAME}`,
        );
        console.log('Conectado a Mongo');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
};

module.exports = connectDB;
