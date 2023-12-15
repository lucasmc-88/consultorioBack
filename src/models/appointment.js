const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    status: { type: String, enum: ['disponible', 'reservado', 'cancelado'], default: 'disponible' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;