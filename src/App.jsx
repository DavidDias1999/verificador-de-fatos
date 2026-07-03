import { useState } from 'react';

function App() {
  // 1. Criando o Estado
  const [textoNoticia, setTextoNoticia] = useState('');

  // 2. Função para lidar com o clique do botão
  const handleVerificar = () => {
    if (!textoNoticia.trim()) {
      alert('Por favor, digite alguma coisa para verificar!');
      return;
    }
    
    // Por enquanto, vamos apenas mostrar no console o que vamos enviar para a IA depois
    console.log("Notícia a ser verificada:", textoNoticia);
    alert("texto a ser usado pela api está sendo exibido no console do navegador, abra o console para ver.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container principal (Card) */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl flex items-center justify-center flex-col">
        
        {/* Cabeçalho */}
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center color-red-600">
          Verificador de Fatos
        </h1>
        <p className="text-slate-500 text-center mb-6">
          Cole abaixo a notícia, citação ou alegação que você deseja checar.
        </p>

        {/* Campo de Texto */}
        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-300 focus:border-blue-500 outline-none resize-none h-40 text-slate-700"
          placeholder="Ex: O chá de limão com alho cura todas as doenças respiratórias..."
          value={textoNoticia}
          onChange={(evento) => setTextoNoticia(evento.target.value)}
        />

        {/* Botão de Ação */}
        <button
          onClick={handleVerificar}
          className="mt-4 w-80 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Verificar Veracidade
        </button>

      </div>
    </div>
  );
}

export default App;