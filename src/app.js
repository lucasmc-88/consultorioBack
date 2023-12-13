const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./db/mongoose');  // Ruta al archivo db.js
const mongoose = require('mongoose')


const specialtyRoute = require('./routes/specialties-routes');
const doctorRoute = require('./routes/doctors-routes');
const userRoute = require('./routes/users-routes');


const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api', specialtyRoute);
app.use('/api', doctorRoute);
app.use('/api', userRoute);

connectDB().then(() => {
    app.listen(3000);
});