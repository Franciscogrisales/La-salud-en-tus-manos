
// Declarar variables globales
let recipes = [];

// Función para cargar recetas
function loadRecipes() {
    console.log("Cargando recetas...");
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = data.recetas;
            displayRecipes(recipes);
        })
        .catch(error => console.error('Error al cargar recetas:', error));
}

// Función para mostrar recetas
function displayRecipes(recipesToDisplay) {
    const recipeList = document.getElementById("recipeList");
    if (!recipeList) return;

    recipeList.innerHTML = '';
    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.nombre}</h3>
            <p><strong>Descripción:</strong> ${recipe.descripcion}</p>
            <p><strong>Beneficio:</strong> ${recipe.beneficio_principal}</p>
            <ul>${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <ol>${recipe.preparacion.map(step => `<li>${step}</li>`).join('')}</ol>
        `;
        recipeList.appendChild(recipeCard);
    });
}

// Función para buscar remedios
function buscarRemedio() {
    const searchInput = document.getElementById("searchBox").value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.nombre.toLowerCase().includes(searchInput) ||
        recipe.descripcion.toLowerCase().includes(searchInput) ||
        recipe.ingredientes.some(ing => ing.toLowerCase().includes(searchInput))
    );
    displayRecipes(filteredRecipes);
}

// 📚 Cargar libros
function loadBooks() {
    console.log("Cargando libros...");
    const bookList = document.getElementById("bookList");
    if (!bookList) return;

    fetch('http://localhost:5500/api/libros')
        .then(response => response.json())
        .then(books => {
            bookList.innerHTML = '';
            books.forEach(book => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${book.title}</strong> - <a href="${book.link}" target="_blank">Descargar</a>`;
                bookList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// 🎵 **Cargar música desde Dropbox**
function loadMusic() {
    console.log("Cargando música relajante...");
    const musicList = document.getElementById("musicList");
    if (!musicList) return;

    // Lista de canciones con enlaces de Dropbox
    const tracks = [
        { title: "Música Binaural para la Concentración", link: "https://www.dropbox.com/scl/fi/561y0l6i2zl7651dd6nr4/Musica-binaural-para-la-concentracion.mp3?rlkey=9swsddddn4zyiins57k9ya24y&raw=1" },
        { title: "Música Clásica para Calmar la Mente", link: "https://www.dropbox.com/scl/fi/nt326gf5gisxwokc7w1fx/Musica-clasica-para-calmar-la-mente.mp3?rlkey=dwbblx9lap02g1c9grtxxdzt8&raw=1" },
        { title: "Regeneración de las Emociones", link: "https://www.dropbox.com/scl/fi/lq5utr9i265g692mcj85v/Regeneracion-de-las-emociones.mp3?rlkey=lr8z8bqlgx2z2pxtx81blrrvf&raw=1" },
        { title: "Música Clásica para la Tranquilidad", link: "https://www.dropbox.com/scl/fi/z2q62gm9b85a4w6958tvr/musica-clasica-para-la-tranquilidad.mp3?rlkey=0f2vlyjlpzlhz7z3sv3s2gbfc&raw=1" },
        { title: "Música Medieval", link: "https://www.dropbox.com/scl/fi/5mmbhvfu6jp0z570e9vj4/musica-medieval.mp3?rlkey=wb3bjqujjfcveglaa55s0zjmd&raw=1" }
    ];

    musicList.innerHTML = '';
    tracks.forEach(track => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${track.title}</strong><br>
            <audio controls>
                <source src="${track.link}" type="audio/mpeg">
                Tu navegador no soporta el elemento de audio.
            </audio>
            <br>
            <a href="${track.link}" target="_blank">Descargar</a>
        `;
        musicList.appendChild(listItem);
    });
}

// **Foro de comentarios**
let comments = [];

function loadComments() {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    commentsList.innerHTML = '';
    comments.forEach((comment, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${comment.name || 'Anónimo'}</strong>: ${comment.text}
            <button onclick="replyToComment(${index})">Responder</button>
            <ul>
                ${comment.replies.map(reply => `<li><strong>${reply.name || 'Anónimo'}:</strong> ${reply.text}</li>`).join('')}
            </ul>
        `;
        commentsList.appendChild(listItem);
    });
}

// Función para agregar un comentario
function addComment(event) {
    event.preventDefault();
    const nameInput = document.getElementById("name").value.trim();
    const commentInput = document.getElementById("comment").value.trim();

    if (!commentInput) return alert('Por favor, escribe un comentario.');

    comments.push({
        name: nameInput,
        text: commentInput,
        replies: []
    });

    document.getElementById("commentForm").reset();
    loadComments();
}

// Función para responder a un comentario
function replyToComment(index) {
    const replyText = prompt('Escribe tu respuesta:');
    if (!replyText) return;

    comments[index].replies.push({
        name: 'Anónimo',
        text: replyText
    });

    loadComments();
}

// 📌 **Ejecutar funciones según la página**
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("recipeList")) loadRecipes();
    if (document.getElementById("bookList")) loadBooks();
    if (document.getElementById("musicList")) loadMusic();
    if (document.getElementById("commentsList")) {
        document.getElementById("commentForm")?.addEventListener('submit', addComment);
        loadComments();
    }
});

//conectar firebase
document.getElementById("btnEnviar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value;
    const comentario = document.getElementById("comentario").value;

    const response = await fetch("/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, comentario })
    });

    const data = await response.json();
    console.log(data.message);
    
});
async function responder(comentarioId) {
    const nombre = prompt("Tu nombre:");
    const respuesta = prompt("Tu respuesta:");

    await fetch("/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentarioId, nombre, respuesta })
    });

    location.reload();
}



