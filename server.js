require('dotenv').config(); // Cargar variables del archivo .env
const express = require('express');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const cors = require ('cors');



const app = express();
app.use(cors());

const PORT = 3000;

// Configuración de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Cargar la clave desde el archivo .env
});

// Configura la carpeta "public" para servir archivos estáticos

app.use(express.static('public'));
app.use(express.json()); // Para manejar datos en formato JSON

// Ruta para obtener dinámicamente los libros
app.get('/api/libros', (req, res) => {
    const librosDir = path.join(__dirname, 'public/libros');
    fs.readdir(librosDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de libros:', err);
            res.status(500).send('Error al obtener los libros');
            return;
        }

        const libros = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => ({
                title: file.replace(/_/g, ' ').replace('.pdf', ''),
                link: `${req.protocol}://${req.get('host')}/libros/${file}`

            }));

        res.json(libros);
    });
});

// Ruta para obtener dinámicamente la música relajante
app.get('/api/musica', (req, res) => {
    const musicaDir = path.join(__dirname, 'public/musica_relajante');
    fs.readdir(musicaDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de música:', err);
            res.status(500).send('Error al obtener la música');
            return;
        }

        const musica = files
            .filter(file => file.endsWith('.mp3'))
            .map(file => ({
                title: file.replace(/_/g, ' ').replace('.mp3', ''),
                link: `/musica_relajante/${file}`,
            }));

        res.json(musica);
    });
});

// Ruta para obtener dinámicamente las recetas desde recipes.json
app.use(express.static('public'));
app.get('/api/recetas', (req, res) => {
    const recipesPath = path.join(__dirname, 'public/recipes.json');
    fsModule.readFile(recipesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer recipes.json:', err);
            res.status(500).send('Error al obtener las recetas');
            return;
        }

        res.json(JSON.parse(data));
    });
});

// Ruta para interactuar con el chatbot
app.post('/api/chat', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'Mensaje no proporcionado.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Cambiar a "gpt-4" si tienes acceso
            messages: [
                { role: 'system', content: 'Eres un asistente especializado en meditación y recetas naturales.' },
                { role: 'user', content: userMessage },
            ],
        });

        const botMessage = response.choices[0].message.content;
        res.json({ botMessage });
    } catch (error) {
        console.error('Error al interactuar con la API de OpenAI:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
