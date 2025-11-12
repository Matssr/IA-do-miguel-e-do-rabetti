// =========================================================================
// script.js (Corrigido para usar o Backend Python)
// =========================================================================

// A URL AGORA APONTA PARA O SEU SERVIDOR PYTHON (porta 5000)
const CHAT_API_URL = 'http://127.0.0.1:5000/api/chat'; 

// NÃO PRECISAMOS MAIS DA CHAVE DE API AQUI (ela está no .env do Python)
// NEM PRECISAMOS IMPORTAR A BIBLIOTECA DO GOOGLE AQUI.

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona os listeners para o botão e para a tecla Enter
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const userMessageText = userInput.value.trim();
    
    if (userMessageText === "") return;

    // Adiciona a mensagem do usuário na tela
    appendMessage(userMessageText, 'user-message');
    userInput.value = ''; 
    
    // Bloqueia a interface
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    userInput.disabled = true;
    
    // Mensagem de carregamento
    const loadingMessage = appendMessage('🤖 IA está digitando...', 'ai-message', 'loading');
    
    try {
        // Faz a chamada HTTP POST para o servidor Python
        const response = await fetch(CHAT_API_URL, {
            method: 'POST', // É crucial usar o método POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userMessageText }),
        });

        const data = await response.json();

        // Verifica se o servidor Python retornou um erro
        if (data.error) {
            throw new Error(data.error);
        }

        const aiResponseText = data.response; 
        
        // Remove carregamento e exibe a resposta
        loadingMessage.remove(); 
        appendMessage(aiResponseText, 'ai-message');

    } catch (error) {
        console.error('Erro ao buscar resposta da IA:', error);
        loadingMessage.remove(); 
        appendMessage(`Desculpe, houve um erro ao processar sua solicitação: ${error.message}`, 'ai-message');
    } finally {
        // Desbloqueia a interface
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function appendMessage(text, className, id = null) {
    const messagesDiv = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = `message ${className}`;
    message.textContent = text;
    if (id) {
        message.id = id;
    }
    messagesDiv.appendChild(message);
    
    // Rola para a mensagem mais recente
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    return message;
}