const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

const getDoctor = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const genderFilter = req.query.gender;

        const startIndex = (page - 1) * limit;

        let query = {};

        if (genderFilter && ['f', 'm'].includes(genderFilter.toLowerCase())) {
            query.gender = genderFilter.toLowerCase();
        }

        const doctors = await Doctor.find(query).populate('specialtyId').skip(startIndex).limit(limit);

        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar los doctores');
    }
};


const createDoctor = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        const doctorsToAdd = req.body;


        if (!Array.isArray(doctorsToAdd)) {
            return res.status(400).json("La solicitud debe ser un arreglo de doctores");
        }

        // Utiliza el método `insertMany` para crear varios doctores a la colección
        const createddoctors = await Doctor.insertMany(doctorsToAdd);

        res.status(201).json({ createddoctors });
    } catch (err) { 
        res.status(500).json({ error: 'Error al crear el médico' });

    }
};

const updateDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.dId;
        const { name, specialtyId, gender } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }
        
        const existingDoctor = await Doctor.findById(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        existingDoctor.name = name || existingDoctor.name;
        existingDoctor.specialtyId = specialtyId || existingDoctor.specialtyId;
        existingDoctor.gender = gender || existingDoctor.gender;

        await existingDoctor.save();

        res.json({ message: 'Médico modificado exitosamente', doctor: existingDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar el médico' });
    }
}

const detailDoctor = async (req, res , next) => {
    try {
        const doctorId = req.params.dId;

        const doctor = await Doctor.findById(doctorId).populate('specialtyId');

        if (!doctor) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }

        // Buscar los turnos disponibles del médico
        const availableAppointments = await Appointment.find({
            doctorId: doctorId,
            status: 'disponible',
        });

        res.json({ doctor, availableAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el detalle del médico' });
    }
}


exports.getDoctor = getDoctor;
exports.createDoctor = createDoctor;
exports.updateDoctor = updateDoctor;
exports.detailDoctor = detailDoctor;