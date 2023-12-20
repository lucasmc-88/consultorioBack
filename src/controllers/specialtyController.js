const Specialty = require('../models/specialty')

const getSpecialty = async (req, res, next) => {
    
    try {

        
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;

        const specialty = await Specialty.find().skip(startIndex)
        .limit(limit);
        res.json(specialty); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar las especialidades');
    }
};


exports.getSpecialty = getSpecialty;