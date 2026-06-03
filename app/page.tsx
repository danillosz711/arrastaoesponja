"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ranking, setRanking] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loadingRank, setLoadingRank] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadRanking() {
      const { data: votes } = await supabase
        .from("votes")
        .select("id, candidate_id");

      const { data: candidates } = await supabase
        .from("candidates")
        .select("*");

      const rank =
        candidates?.map((candidate) => ({
          ...candidate,
          votos:
            votes?.filter(
              (vote) => vote.candidate_id === candidate.id
            ).length || 0,
        })) || [];

      rank.sort((a, b) => b.votos - a.votos);

      setTotalVotes(votes?.length || 0);
      setRanking(rank);
      setLoadingRank(false);
    }

    loadRanking();
  }, []);

  async function validarCodigo() {
    const trimmed = code.trim();

    if (!trimmed) {
      setErrorMessage("Digite um código válido");
      return;
    }

    setErrorMessage("");

    const { data: voteCode } = await supabase
      .from("vote_codes")
      .select("*")
      .eq("code", trimmed)
      .single();

    if (!voteCode || voteCode.used) {
      setErrorMessage("Código inválido ou utilizado");
      return;
    }

    router.push(`/votar?code=${encodeURIComponent(trimmed)}`);
  }

  function medalha(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    if (index === 3) return "4️⃣";
    if (index === 4) return "5️⃣";
    return `${index + 1}º`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-white flex flex-col items-center p-6">

      {/* LOGO */}
      <div className="flex justify-center mb-4">
        <img
          src="/logo-arrastao.jpg"
          alt="Arrastão do Esponja"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      {/* TÍTULO */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center text-pink-600 mb-2">
        Gata do Esponja
      </h1>

      <p className="text-center text-gray-700 text-base md:text-lg mb-8">
        🎉 Concurso Oficial do Arrastão do Esponja - São João 2026 ✨
      </p>

      {/* CÓDIGO */}
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md text-center mb-12">
        <p className="text-gray-700 font-medium mb-4">
          Digite o código recebido para acessar a votação:
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite seu código"
          className="w-full p-4 rounded-2xl border-2 border-pink-300 text-black mb-4 focus:outline-none focus:ring-4 focus:ring-pink-300"
        />

        <button
          onClick={validarCodigo}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-extrabold py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          ENTRAR PARA VOTAR
        </button>

        {errorMessage && (
          <p className="text-red-500 font-bold mt-4">{errorMessage}</p>
        )}
      </div>

      {/* TOP 5 */}
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl md:text-5xl font-extrabold text-pink-600 mb-3 text-center">
          🏆 TOP 5 MAIS VOTADAS
        </h2>

        <p className="text-center text-gray-700 text-lg md:text-xl mb-8 font-semibold">
          Total de votos registrados: <span className="text-pink-600">{totalVotes}</span>
        </p>

        {loadingRank ? (
          <p className="text-center text-gray-600">Carregando ranking...</p>
        ) : (
          ranking.slice(0, 5).map((candidate, index) => {
            const porcentagem =
              totalVotes > 0 ? ((candidate.votos / totalVotes) * 100).toFixed(1) : 0;

            return (
              <div
                key={candidate.id}
                className="bg-white rounded-3xl p-5 mb-5 shadow-lg border border-pink-100 flex items-center gap-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* FOTO COM GRADIENTE ESTILO STORY */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-yellow-400 to-pink-500 shadow-lg">
                    <img
                      src={candidate.photo_url}
                      alt={candidate.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <span className="absolute -top-3 -left-3 text-2xl">{medalha(index)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-extrabold text-black text-xl md:text-2xl">{candidate.name}</h3>
                    <span className="font-bold text-pink-600 text-lg">{candidate.votos} voto(s)</span>
                  </div>

                  <div className="w-full bg-pink-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-pink-500 h-4 rounded-full"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">{porcentagem}% dos votos</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">
         Concurso Gata do Esponja 2026
      </p>

      <p className="text-center text-gray-500 text-sm mt-2 mb-6">
        Desenvolvido por{" "}
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-pink-500"
        >
          DevDan
        </a>
      </p>
    </main>
  );
}