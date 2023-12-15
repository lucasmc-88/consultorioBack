const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Specialty = require('../models/specialty');

const createAppoinment =  async (req, res) => {
    const { date, time, doctorId,status } = req.body;
    try {
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }
        
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

const updateAppoinment = async (req, res , next) => {
    try {
        const appointmentId = req.params.aId;
        const { status } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

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

const deleteAppoinment = async (req, res, next) => {
    try {
        const appointmentId = req.params.aId;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }


        if (appointment.status !== 'disponible') {
            return res.status(400).json({ error: 'El turno no está disponible para eliminar' });
        }

        
        await appointment.deleteOne({ _id: appointmentId });

        res.json({ message: 'Turno eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el turno' });
    }
}
const getAppoinmentByDoctorId = async (req, res, next) => {
    try {
        const doctorId = req.params.dId;

        // Verificar si el médico existe
        const doctorExists = await Doctor.findById({ _id: doctorId });

        if (!doctorExists) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        // Buscar los turnos por médico
        const appointmentsByDoctor = await Appointment.find({ doctorId: doctorId }).populate('doctorId');

        res.json( appointmentsByDoctor );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos por médico' });
    }
}
exports.createAppoinment = createAppoinment
exports.updateAppoinment = updateAppoinment
exports.deleteAppoinment = deleteAppoinment
exports.getAppoinmentByDoctorId = getAppoinmentByDoctorId