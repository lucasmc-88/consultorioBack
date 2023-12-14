const User = require('../models/user');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password,role } = req.body;

        // Verificar si el usuario o el correo electrónico ya existen
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario o el correo electrónico ya existen' });
        }

        // Crear un nuevo usuario
        const newUser = new User({ name, email, password, role });

        // Generar un token JWT
        const token = await newUser.generateAuthToken();

        // Guardar el usuario en la base de datos
        await newUser.save();

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por nombre de usuario
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y la contraseña es correcta
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }

        // Generar un token JWT
        const token = await user.generateAuthToken();

        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;