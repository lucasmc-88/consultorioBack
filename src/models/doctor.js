const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialtyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
    gender: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Verifica que 'v' sea 'f' o 'm'
                return /^[fm]$/i.test(v);
            },
            message: props => `${props.value} no es una letra válida para el sexo. Debe ser 'f' o 'm'.`
        },
        set: value => value.toLowerCase()  // Convierte a minúsculas
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);