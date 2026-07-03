# 🕵️‍♂️ Verificador de Fatos Inteligente (Smart Fact-Checker)

Um aplicativo web moderno focado no combate à desinformação. Ele permite que os usuários pesquisem por notícias, citações ou alegações, consultando agências de checagem de fatos oficiais e utilizando Inteligência Artificial para interpretar e contextualizar os resultados de forma clara para o público leigo.

## 🎥 Demonstração

https://github.com/user-attachments/assets/d16a76a8-3b02-4874-8558-f90cb5c7d0d9


## 🚀 Tecnologias Utilizadas

*   **Frontend:** React.js, inicializado com Vite.
*   **Estilização:** Tailwind CSS v4 (via plugin oficial do Vite).
*   **APIs e Integrações:**
    *   **Google Fact Check Tools API:** Para buscar dados estruturados e oficiais de agências de checagem globais (como Agência Lupa, Aos Fatos, AFP, etc).
    *   **Google Gemini API (gemini-pro):** Atua como uma "editora-chefe", lendo os dados brutos da API de checagem e gerando um parágrafo conciso e contextualizado para evitar falsos positivos na interpretação do usuário final.

## 🧠 Decisão Arquitetural e de Segurança

Este projeto foi desenhado como uma aplicação Client-Side Rendering (CSR). Para manter as boas práticas de segurança e evitar a exposição de chaves de API (`API Keys`) que poderiam gerar uso indevido e cobranças, optei por **não hospedar** esta aplicação de forma pública sem um serviço de Backend intermediário. 

A demonstração do funcionamento ideal está no vídeo acima. Caso deseje avaliar o código e rodar a aplicação localmente, siga as instruções abaixo.

## ⚙️ Como rodar o projeto localmente

Para executar este projeto na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) instalado e gerar suas próprias chaves de API gratuitas no Google Cloud e no Google AI Studio.

**1. Clone o repositório e instale as dependências:**
```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd verificador-de-fatos
npm install
```

**2. Configure as Variáveis de Ambiente:**
Crie um arquivo chamado `.env.local` na raiz do projeto. Este arquivo está no `.gitignore` e não será monitorado pelo Git. Adicione as suas chaves com a seguinte estrutura:

```text
VITE_GOOGLE_API_KEY=sua_chave_do_google_fact_check_api_aqui
VITE_GEMINI_API_KEY=sua_chave_do_google_gemini_aqui
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O aplicativo estará rodando em `http://localhost:5173`.
