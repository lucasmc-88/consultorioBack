const Specialty = require('../models/specialty')

const getSpecialty = async (req, res, next) => {
    let specialty;

    try {
        specialty = await Specialty.find();
        res.json(specialty); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar las especialidades');  // Envía una respuesta de error
    }
};


exports.getSpecialty = getSpecialty;