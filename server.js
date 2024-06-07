const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { getImages, addImage, deleteImage, login, authenticateJWT } = require('./back');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../Front/public')));

// Rutas para gestionar imágenes
app.get('/images', (req, res) => {
    res.json(getImages());
});

app.post('/images', (req, res) => {
    const image = req.body.image;
    const newImage = addImage(image);
    res.status(201).json(newImage);
});

app.delete('/images/:index', authenticateJWT, (req, res) => { // Añadir autenticación JWT
    const index = parseInt(req.params.index);
    if (deleteImage(index)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const token = login(username, password);

    if (token) {
        res.json({ token });
    } else {
        res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }
});

// Ruta protegida
app.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});

// Proteger la ruta de index-admin.html
app.get('/index-admin.html', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/public', 'index-admin.html'));
});

// Proteger la ruta de menu-admin.html
app.get('/menu-admin.html', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/public', 'menu-admin.html'));
});

// Rutas existentes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});