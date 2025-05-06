// Selección de elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userMessage');
const sendMessageButton = document.getElementById('sendMessage');

//comprobar que IA funcione
console.log("Mensaje enviado:", userMessage);
console.log("Cuerpo de la solicitud:", JSON.stringify({ message: userMessage }));
 
// Función para agregar mensajes al chat
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Desplazar el chat hacia abajo
}

// Función para manejar el envío de mensajes
async function handleSendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    // Agregar el mensaje del usuario al chat
    addMessageToChat('Usuario', userMessage);

    // Limpiar el campo de entrada
    userInput.value = '';



    try {
        // Llamar al servidor para obtener la respuesta de la IA
        console.log(userMessage)
        const response = await fetch('https://la-salud-en-tus-manos.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message:  userMessage })
        });
        if (!response.ok) throw new Error (`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Agregar la respuesta de la IA al chat
        addMessageToChat('Maestro-IA', data[0].generated_text);
    } catch (error) {
        console.error('Error al obtener respuesta del servidor:', error);
        addMessageToChat('Maestro-IA', 'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    }
}

// Evento para el botón de enviar
sendMessageButton.addEventListener('click', handleSendMessage);

// Evento para enviar el mensaje al presionar Enter
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});

