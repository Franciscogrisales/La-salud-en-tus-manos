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

    fetch('/api/libros')
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

// 🎵 Cargar música relajante
function loadMusic() {
    console.log("Cargando música relajante...");
    const musicList = document.getElementById("musicList");
    if (!musicList) return;

    fetch('/api/musica')
        .then(response => response.json())
        .then(tracks => {
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
                    <a href="${track.link}" download>Descargar</a>
                `;
                musicList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar la música:', error));
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

function replyToComment(index) {
    const replyText = prompt('Escribe tu respuesta:');
    if (!replyText) return;

    comments[index].replies.push({
        name: 'Anónimo',
        text: replyText
    });

    loadComments();
}

// 📌 Ejecutar funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("recipeList")) loadRecipes();
    if (document.getElementById("bookList")) loadBooks();
    if (document.getElementById("musicList")) loadMusic();
    if (document.getElementById("commentsList")) {
        document.getElementById("commentForm")?.addEventListener('submit', addComment);
        loadComments();
    }
});
