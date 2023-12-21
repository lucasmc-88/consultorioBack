const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const User = require('../models/user');


const createAppoinment = async (req, res) => {
    const { date, time, doctorId, status, patient } = req.body;
    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        const newDate = new Date(date);
        const formattedDate = newDate.toISOString().split('T')[0];

        const newAppointment = new Appointment({
            date: formattedDate,
            time,
            doctorId,
            status,
            patient,
        });

        await newAppointment.save();

        res.status(201).json({ message: 'Turno creado exitosamente', appointment: newAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el turno' });
    }
};

const updateAppoinment = async (req, res, next) => {
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
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        const doctorExists = await Doctor.findById({ _id: doctorId });

        if (!doctorExists) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        // Calcular el índice de inicio de la paginación
        const startIndex = (page - 1) * limit;

        // Buscar los turnos por médico con paginación
        const appointmentsByDoctor = await Appointment
            .find({ doctorId: doctorId })
            .populate('doctorId')
            .skip(startIndex)
            .limit(limit);

        res.json(appointmentsByDoctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos por médico' });
    }
}

const getAppoinmentByPatient = async (req, res, next) => {
    try {
        const  userId  = req.user._id; 

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;

        // Buscar los turnos del paciente por su ID
        const appointments = await Appointment.find({ patient: userId })
        .skip(startIndex)
        .limit(limit);
        
        if (appointments.length === 0) {
            return res.status(404).json({ error: 'No tiene turnos reservados o cancelados' });
        }

        res.json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos del paciente' });
    }
}

const getCancelByPatient = async (req, res, next) => {
    try {
        const  userId  = req.user._id; // Obtener el ID del usuario desde el token JWT
        console.log(userId + '****');

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;

      
        const appointments = await Appointment.find({ patient: userId, status: 'cancelado' }).skip(startIndex)
        .limit(limit);
        
        if (appointments.length === 0) {
            return res.status(404).json({ error: 'No tiene turnos cancelados' });
        }

        res.json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos del paciente' });
    }
}

const reserveAppointment = async (req, res, next) => {
    try {
        const { aId } = req.params;
        const userId = req.user._id;

        if (req.user.role !== 'patient') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }
        const appointment = await Appointment.findById(aId);

        if (!appointment) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }


        if (appointment.status !== 'disponible') {
            return res.status(400).json({ error: 'El turno no está disponible para reservar' });
        }

        appointment.status = 'reservado';
        appointment.patient = userId;
        await appointment.save();

        res.json({ message: 'Turno reservado exitosamente', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al reservar el turno' });
    }
}

const cancelAppointment = async (req, res, next) => {
    try {
        const { aId } = req.params;;
        const userId = req.user._id;
        console.log(userId + '*****');

        if (req.user.role !== 'patient') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        const appointment = await Appointment.findById(aId);
        console.log(appointment.status + ' cita');
        if (!appointment) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }


        if (appointment.status !== 'reservado' || appointment.patient.toString() != userId) {
            return res.status(400).json({ error: 'No puedes cancelar este turno' });
        }

        appointment.status = 'cancelado';
        //appointment.patient = undefined;
        await appointment.save();

        res.json({ message: 'Turno cancelado exitosamente', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cancelar el turno' });
    }
}
exports.createAppoinment = createAppoinment
exports.updateAppoinment = updateAppoinment
exports.deleteAppoinment = deleteAppoinment
exports.getAppoinmentByDoctorId = getAppoinmentByDoctorId
exports.reserveAppointment = reserveAppointment
exports.cancelAppointment = cancelAppointment
exports.getAppoinmentByPatient = getAppoinmentByPatient
exports.getCancelByPatient = getCancelByPatient