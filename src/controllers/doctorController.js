const Doctor = require('../models/doctor');

const getDoctor = async (req, res, next) => {
    let doctor;

    try {
        doctor = await Doctor.find().populate('specialtyId');
        res.json(doctor);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar los doctores'); 
    }
};

const createDoctor = async (req, res, next) => {
    try {
        const doctorsToAdd = req.body;

        // Valida que req.body sea un array de doctores
        if (!Array.isArray(doctorsToAdd)) {
            res.status(400).json("La solicitud debe ser un arreglo de doctores");
        }

        // Utiliza el método `insertMany` para crear varios doctores a la coleccion
        const createddoctors = await Product.insertMany(doctorsToAdd);

        res.status(201).json({ createddoctors });
    } catch (err) { 
        const error = new HttpError(
            'Error al crear los doctores'
        );
        return next(error)
    }
};


exports.getDoctor = getDoctor;
exports.createDoctor = createDoctor; 