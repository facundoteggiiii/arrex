const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const imagesFilePath = path.join(__dirname, 'data', 'images.json');

// Leer imágenes desde el archivo JSON
let images = [];
if (fs.existsSync(imagesFilePath)) {
    images = JSON.parse(fs.readFileSync(imagesFilePath));
}

// Funciones para gestionar imágenes
const getImages = () => images;

const addImage = (image) => {
    images.push(image);
    fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2));
    return image;
};

const deleteImage = (index) => {
    if (index >= 0 && index < images.length) {
        images.splice(index, 1);
        fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2));
        return true;
    }
    return false;
};

// Usuario y contraseña predefinidos
const predefinedUsername = 'cristian';
const predefinedPasswordHash = '$2b$10$uxU.jcGAkHCViTFxOhHu8O08GR7V3DIfOi5Gy242vlIvkvMnJSrKi';

// Función para iniciar sesión
const login = (username, password) => {
    if (username === predefinedUsername && bcrypt.compareSync(password, predefinedPasswordHash)) {
        return jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    }
    return null;
};

// Middleware para verificar el token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    getImages,
    addImage,
    deleteImage,
    login,
    authenticateJWT
};