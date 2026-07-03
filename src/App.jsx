import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  // 1. Criando os Estados
  const [textoNoticia, setTextoNoticia] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState("");
  const [resumoIA, setResumoIA] = useState("");

  // 2. Função para lidar com o clique do botão
  const handleVerificar = async () => {
    if (!textoNoticia.trim()) {
      alert("Por favor, digite alguma coisa para verificar!");
      return;
    }

    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!googleApiKey || !geminiApiKey) {
      alert("Aviso: As chaves de API não estão configuradas no .env.local!");
      return;
    }

    setCarregando(true);
    setErro("");
    setResultados([]);
    setResumoIA("");

    try {
      setErro("");
      setResultados([]);
      // encodeURIComponent garante que espaços e acentos não quebrem o link
      const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(textoNoticia)}&key=${googleApiKey}`;

      // O 'await' faz o código esperar a resposta do Google chegar
      const resposta = await fetch(url);

      // Converte a resposta para um objeto JavaScript (JSON)
      const dados = await resposta.json();

      if (dados.claims && dados.claims.length > 0) {
        setResultados(dados.claims);
        try {
          // Inicializa o SDK do Gemini
          const genAI = new GoogleGenerativeAI(geminiApiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

          const prompt = `
            Você é um jornalista especializado em checagem de fatos, escrevendo para o público em geral.
            O usuário pesquisou pela frase: "${textoNoticia}".
            A API retornou as seguintes checagens: ${JSON.stringify(dados.claims)}.
            
            Sua tarefa: Escreva um único parágrafo muito conciso (máximo de 3 a 4 linhas) dando o veredito final.
            
            REGRAS ABSOLUTAS:
            1. NÃO faça listas e NÃO repita os detalhes técnicos de cada agência de checagem.
            2. Vá direto ao ponto. Avalie a essência do que o usuário pesquisou com base nos dados.
            3. Se a pesquisa do usuário for um fato amplamente verdadeiro e comprovado (como "vacinas salvam vidas", "a terra é redonda"), e os dados da API apenas mostrarem fake news absurdas sendo desmentidas sobre o tema, escreva EXATAMENTE nesta linha: "Esta afirmação é verdadeira e um consenso. As agências de checagem listadas abaixo apenas registraram e desmentiram boatos e peças de desinformação que tentavam atacar esse fato."
          `;

          // Dispara a pergunta para o Gemini e aguarda a resposta
          const resultadoIA = await model.generateContent(prompt);
          setResumoIA(resultadoIA.response.text());
        } catch (erroIA) {
          console.error("ERRO DETALHADO DA IA:", erroIA); // Isso vai imprimir o erro completo no console do navegador
          setResumoIA("Erro na IA: " + (erroIA.message || "Erro desconhecido"));
        }
      } else {
        setErro("Nenhuma checagem de fatos encontrada para este termo.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert("Ocorreu um erro ao tentar conectar com os servidores do Google.");
    } finally {
      // O 'finally' sempre executa no final, dando erro ou não. Desligamos o loading.
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container principal (Card) */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl flex items-center justify-center flex-col">
        {/* Cabeçalho */}
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center text-red-600">
          Verificador de Fatos
        </h1>
        <p className="text-slate-500 text-center mb-6">
          Cole abaixo a notícia, citação ou alegação que você deseja checar.
        </p>

        {/* Campo de Texto */}
        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-300 focus:border-blue-500 outline-none resize-none h-40 text-slate-700 disabled:bg-gray-100 disabled:opacity-70"
          placeholder="Ex: O chá de limão com alho cura todas as doenças respiratórias..."
          value={textoNoticia}
          onChange={(evento) => setTextoNoticia(evento.target.value)}
          disabled={carregando} // Trava o campo enquanto busca
        />

        {/* Botão de Ação */}
        <button
          onClick={handleVerificar}
          disabled={carregando} // Trava o botão enquanto busca
          className={`mt-4 w-80 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 
            ${carregando ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {carregando ? "Buscando nos arquivos..." : "Verificar Veracidade"}
        </button>

        {/* SEÇÃO DE RESULTADOS */}
        <div className="w-full max-w-2xl mt-6">
          {/* Mostra mensagem de erro se houver */}
          {erro && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-medium">
              {erro}
            </div>
          )}
          {/* RENDERIZA O RESUMO DA IA --> */}
          {resumoIA && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6 shadow-sm">
              <h2 className="text-purple-800 font-bold mb-2 flex items-center text-lg">
                ✨ Análise Inteligente
              </h2>
              <p className="text-purple-900 leading-relaxed whitespace-pre-wrap">
                {resumoIA}
              </p>
            </div>
          )}

          {/* Mapeia e desenha cada resultado encontrado */}
          {resultados.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-blue-500"
            >
              <p className="text-sm text-slate-500 mb-1">
                <strong>Alegação:</strong> "{item.text}"
              </p>
              <p className="text-sm text-slate-500 mb-3">
                <strong>Quem disse:</strong> {item.claimant || "Desconhecido"}
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Resultado da Checagem:
                </p>
                {/* Pegamos a primeira avaliação disponível */}
                {item.claimReview && item.claimReview.length > 0 ? (
                  <>
                    <p className="text-lg font-bold text-slate-800">
                      {item.claimReview[0].textualRating}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Fonte:{" "}
                      <a
                        href={item.claimReview[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.claimReview[0].publisher.name}
                      </a>
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    Avaliação não disponível.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
