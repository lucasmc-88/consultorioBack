const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    // Otros campos relacionados con el turno
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
