import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 
import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { error } from "console";
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// historial de memoria//
let conversationHistory = {
    past_user_inputs: [],
    generated_responses: []
};



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const firebaseConfig = {
    apiKey: "AIzaSyBiwNT4kJ6TZglNWYmHW-4Wz_T_DExlI94",
    authDomain: "la-salud-en-tus-manos-ad417.firebaseapp.com",
    projectId: "la-salud-en-tus-manos-ad417",
    storageBucket: "la-salud-en-tus-manos-ad417.appspot.com",
    messagingSenderId: "105485182842",
    appId: "1:105485182842:web:282f58198d5b22613818c3"  
};

app.get('/debug/listar-libros', (req, res) => {
    const librosDir = path.join(__dirname, 'public/libros');
    fs.readdir(librosDir, (err, files) => {
      if (err) return res.status(500).send('Error leyendo libros');
      res.send(files.join('<br>'));
    });
  });
  

// Inicializar Firebase
const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Ruta para guardar comentarios
app.post("/comentarios", async (req, res) => {
    try {
        const { nombre, comentario } = req.body;
        const docRef = await addDoc(collection(db, "comentarios"), {
            nombre: nombre || "Anónimo",
            comentario,
            respuestas: []  // Inicialmente sin respuestas
        });
        res.status(200).json({ id: docRef.id, message: "Comentario guardado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//guardar respuestas
app.post("/responder", async (req, res) => {
    try {
        const { comentarioId, nombre, respuesta } = req.body;
        const comentarioRef = doc(db, "comentarios", comentarioId);

        await updateDoc(comentarioRef, {
            respuestas: arrayUnion({ nombre: nombre || "Anónimo", respuesta })
        });

        res.status(200).json({ message: "Respuesta guardada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//obtener comentarios y respuestas
app.post("/responder", async (req, res) => {
    try {
        const { comentarioId, nombre, respuesta } = req.body;
        const comentarioRef = doc(db, "comentarios", comentarioId);

        await updateDoc(comentarioRef, {
            respuestas: arrayUnion({ nombre: nombre || "Anónimo", respuesta })
        });

        res.status(200).json({ message: "Respuesta guardada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//validar el import chat



const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); // Para manejar datos en formato JSON

// Configura la carpeta "public" para servir archivos estáticos


// Ruta para obtener dinámicamente los libros
app.get('/api/libros', (req, res) => {
    const librosDir = path.join(__dirname, 'public/libros');
    fs.readdir(librosDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de libros:', err.message);
            res.status(500).json({error: 'Error al obtener los libros'});
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
    const { message } = req.body.message;
    if (!message){
        return res.status(400).json({ error: 'Mensaje no proporcionado'});
    }
    
    if (!message) {
        return res.status(400).json({ error: 'Mensaje no proporcionado.' });
    }
   

    try {
        const messages = [];
        for (let i = 0; i < conversationHistory.past_user_inputs.length; i++){
            messages.push({role: "user", content: conversationHistory.past_user_inputs[i] });
            messages.push({role: "assistant", content: conversationHistory.generated_responses[i]});
        }
        //agregar mensaje nuevo
        messages.push({ role: "user", content: message});
        //llamar OPENAI
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7,
            max_tokens: 100,
        });
       const botReply = completion.data.choices[0].message.content;
       conversationHistory.past_user_inputs.push(message)
       conversationHistory.generated_responses.push(botReply)
       console.log("Respuesta de OpenAI", botReply);

       res.json({ message: botReply});
      

       
            
        

        

        
    } catch (error) {
        console.error("Error al llamar a la API de OpenAI", error);
        res.status(500).json({ error: 'Error interno del servidor.' });

    }
});

// Inicia el servidor

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log("servidor iniciado");
    console.log("API KEY:", process.env.OPENAI_API_KEY);
});
