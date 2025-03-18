const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");


dotenv.config(); 

const app = express();
app.use(cors());

let conversationHistory = {
    past_user_inputs: [],
    generated_responses: []
};

//validar el import chat



const PORT = process.env.PORT || 5500;

app.use(express.static('public'));
app.use(express.json()); // Para manejar datos en formato JSON

// Configura la carpeta "public" para servir archivos estáticos


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
app.get("/", (req, res) => {
    console.log("Ruta raíz / llamada");
    res.send("Servidor funcionando");
});
// Ruta para interactuar con el chatbot
app.post("/api/chat", async (req, res) => {
    console.log("Cuerpo de la petición:", req.body); 
    console.log("Ruta /api/chat ha sido llamada");
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mensaje no proporcionado.' });
    }
   
    try {
        const body = {
            inputs:{
                past_user_inputs: conversationHistory.past_user_inputs,
                generated_responses: conversationHistory.generated_responses,
                text: message
            },
            parameters: {
                max_length: 60,
                temperature: 0.7
            }
        };
        const response = await fetch("https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",{
            method: "POST",
            headers:{
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        
        
        });

       
            
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Error en la API de Hugging Face: ${response.status} ${response.statusText}`);
          }
        if(!Array.isArray(data) || data.length ===0 || !data[0].generated_text){
            throw    new Error('Respuesta invalida de HugginFace');
        }  

        
        let botReply= Array.isArray(data) ? data[0].generated_text: data.generated_text;
        conversationHistory.past_user_inputs.push(message);
        conversationHistory.generated_responses.push(botReply);
        console.log("Respuesta de hugginFace:", data);
        res.json({ message: botReply});
        
    } catch (error) {
        console.error("Error al llamar a la API de hugginFace")
        res.status(500).json({ error: 'Error interno del servidor.' });

    }
});

// Inicia el servidor

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log("servidor iniciado");
    console.log("API KEY:", process.env.HUGGINGFACE_API_KEY);
});
