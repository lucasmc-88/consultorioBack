const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const specialtyRoute = require('./routes/specialties-routes');


const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api', specialtyRoute);

mongoose
    .connect(
        //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v4ofevg.mongodb.net/${process.env.DB_NAME}`
        `mongodb+srv://crudVortex:akademyVortex@cluster0.v4ofevg.mongodb.net/consultorio`
    )
    .then(() => {
        app.listen(3000);
        console.log('Conectado');

    })
    .catch((err) =>{
        console.log('Error conexion');
    });