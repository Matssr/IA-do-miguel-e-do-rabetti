from flask import Flask, request, jsonify
from flask_cors import CORS # Essencial para permitir o acesso do Frontend
from google import genai
from dotenv import load_dotenv
import os

# Carrega a chave de API de forma segura do arquivo .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
# Permite que qualquer origem (seu Frontend) acesse este Backend
CORS(app) 

# Inicializa o cliente Gemini
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
    print("✅ Cliente Gemini inicializado com sucesso.")
else:
    print("❌ ERRO: GEMINI_API_KEY não encontrada. O chat não funcionará.")

# Rota que o JavaScript chamará
@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    if client is None:
        return jsonify({"error": "Configuração da API falhou."}), 500
        
    data = request.get_json()
    prompt = data.get('prompt')

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt]
        )
        # Retorna a resposta da IA para o JavaScript
        return jsonify({"response": response.text})

    except Exception as e:
        print(f"Erro na API do Gemini: {e}")
        return jsonify({"error": "Erro ao se comunicar com a IA."}), 500

if __name__ == '__main__':
    # O servidor Python roda na porta 5000
    app.run(debug=True, host='0.0.0.0', port=5000)