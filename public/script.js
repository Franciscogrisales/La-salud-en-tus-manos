// Declarar variables globales
let recipes = [];

// Función para cargar recetas
function loadRecipes() {
    console.log("Cargando recetas...");
    fetch('recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data.recetas;
            displayRecipes(recipes);
        })
        .catch(error => console.error('Error al cargar recetas:', error));
}

// Función para mostrar recetas
function displayRecipes(recipesToDisplay) {
    const recipeList = document.getElementById("recipeList");
    if (!recipeList) {
        console.error("No se encontró el contenedor con id 'recipeList'.");
        return;
    }

    recipeList.innerHTML = '';
    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.nombre}</h3>
            <p><strong>Descripción:</strong> ${recipe.descripcion}</p>
            <p><strong>Beneficio:</strong> ${recipe.beneficio_principal}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <p><strong>Preparación:</strong></p>
            <ol>${recipe.preparacion.map(step => `<li>${step}</li>`).join('')}</ol>
            <p><strong>Categoría:</strong> ${recipe.categoria}</p>
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

// Función para cargar libros
function loadBooks() {
    console.log("Cargando libros...");
    const bookList = document.getElementById("bookList");

    if (!bookList) {
        console.error("No se encontró el contenedor con id 'bookList'.");
        return;
    }

    fetch('/api/libros')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(books => {
            bookList.innerHTML = '';
            books.forEach(book => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${book.title}</strong> - 
                    <a href="${book.link}" target="_blank">Descargar</a>`;
                bookList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Función para cargar música
function loadMusic() {
    console.log("Cargando música relajante...");
    const musicList = document.getElementById("musicList");

    if (!musicList) {
        console.error("No se encontró el contenedor con id 'musicList'.");
        return;
    }

    fetch('/api/musica')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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

// Ejecutar funciones según la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("recipeList")) {
        loadRecipes();
    }
    if (document.getElementById("bookList")) {
        loadBooks();
    }
    if (document.getElementById("musicList")) {
        loadMusic();
    }
});
// Array global para almacenar comentarios
let comments = [];

// Función para cargar comentarios existentes
function loadComments() {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    commentsList.innerHTML = ''; // Limpiar lista
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

// Función para agregar un nuevo comentario
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
        name: 'Anónimo', // Puedes capturar el nombre si quieres
        text: replyText
    });

    loadComments();
}

// Asociar eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en la página del foro
    if (document.getElementById("commentsList")) {
        const commentForm = document.getElementById("commentForm");
        if (commentForm) {
            commentForm.addEventListener('submit', addComment);
        }
        loadComments();
    }
});

