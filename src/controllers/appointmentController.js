const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Specialty = require('../models/specialty');

const createAppoinment =  async (req, res) => {
    const { date, time, doctorId,status } = req.body;
    try {
        
        
        
        const doctor = await Doctor.findById(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        const newAppointment = new Appointment({
            date: new Date(date + ' ' + time),
            time,
            doctorId,
            status,
        });

        await newAppointment.save();

        res.status(201).json({ message: 'Turno creado exitosamente', appointment: newAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el turno' });
    }
};

const UpdateAppoinment = async (req, res , next) => {
    try {
        const appointmentId = req.params.aId;
        const { status } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        // Actualizar el estado del turno
        appointment.status = status;
        await appointment.save();

        res.json({ message: 'Estado del turno actualizado exitosamente', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el turno' });
    }
}

exports.createAppoinment = createAppoinment
exports.UpdateAppoinment = UpdateAppoinment