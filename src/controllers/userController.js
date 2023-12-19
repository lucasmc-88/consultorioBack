const User = require('../models/user');
const nodemailer = require('nodemailer');

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

const generateEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Verificar si el usuario con el correo electrónico existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar y almacenar un token de recuperación de contraseña en el usuario
        /*const recoveryToken = generateRecoveryToken(user._id);

        user.recoveryToken = recoveryToken;
        await user.save();*/

        // Configurar nodemailer para enviar el correo electrónico
        const transporter = nodemailer.createTransport({
            service: 'OUTLOOK',
            auth: {
                user: process.env.EMAIL_USER, // Coloca aquí tu dirección de correo electrónico
                pass: 'Hecafivi2020',//process.env.EMAIL_PASSWORD, // Coloca aquí tu contraseña
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to:process.env.EMAIL_USER, // user.email,
            subject: 'Recuperación de Contraseña',
            text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: http://tu-aplicacion.com/reset-password/`,

            //text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: http://tu-aplicacion.com/reset-password/${recoveryToken}`,
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Correo electrónico de recuperación enviado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al solicitar recuperación de contraseña' });
    }
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.generateEmail = generateEmail