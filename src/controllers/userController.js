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
        console.log('ingreso correctamente');
        res.json({ message: 'ingreso correcto', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
const logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

const generateEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar y almacenar un nuevo token de recuperación de contraseña en el usuario
        const recoveryToken = await user.generateAuthToken();
        console.log(recoveryToken);


        await user.save();

        // Configurar nodemailer para enviar el correo electrónico
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // user.email,
            subject: 'Recuperación de Contraseña',
            text: `Para recuperar tu contraseña, haz clic en el siguiente enlace:  http://tu-aplicacion.com/reset-password/
                    Token de recuperación: ${recoveryToken}`,
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Correo electrónico de recuperación enviado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al solicitar recuperación de contraseña' });
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, recoveryToken, newPassword } = req.body;

        // Buscar al usuario por el token de recuperación y correo electrónico
        const user = await User.findOne({ email, 'tokens.token': recoveryToken });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado o token inválido' });
        }

        // Verificar si el token de recuperación proporcionado es válido
        const tokenIndex = user.tokens.findIndex(tokenObj => tokenObj.token === recoveryToken);
        if (tokenIndex === -1) {
            return res.status(400).json({ error: 'Token de recuperación no válido' });
        }

        // Cambiar la contraseña y eliminar el token de recuperación
        user.password = newPassword;
        user.tokens.splice(tokenIndex, 1);
        await user.save();

        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logout = logout
exports.generateEmail = generateEmail
exports.resetPassword = resetPassword