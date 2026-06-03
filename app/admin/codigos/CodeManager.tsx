"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type VoteCode = {
  id: string;
  code: string;
  used: boolean;
};

export default function CodeManager() {
  const [codes, setCodes] = useState<VoteCode[]>([]);
  const [quantidade, setQuantidade] = useState(10);
  const [loading, setLoading] = useState(false);

  async function loadCodes() {
    const { data } = await supabase
      .from("vote_codes")
      .select("*")
      .order("code");

    setCodes(data || []);
  }

  function gerarCodigo() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result = "";

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    return result;
  }

  async function gerarCodigos() {
    setLoading(true);

    try {
      const novosCodigos = [];

      for (let i = 0; i < quantidade; i++) {
        novosCodigos.push({
          code: gerarCodigo(),
          used: false,
        });
      }

      const { error } = await supabase
        .from("vote_codes")
        .insert(novosCodigos);

      if (error) {
        alert(error.message);
      } else {
        alert(
          `${quantidade} código(s) gerado(s) com sucesso!`
        );

        loadCodes();
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar códigos");
    }

    setLoading(false);
  }
async function resetarVotacao() {
  const confirmar = confirm(
    "ATENÇÃO!\n\nIsso irá apagar TODOS os votos e reativar TODOS os códigos.\n\nDeseja continuar?"
  );

  if (!confirmar) return;

  const { error: votosError } = await supabase
    .from("votes")
    .delete()
    .not("id", "is", null);

  if (votosError) {
    alert(votosError.message);
    return;
  }

  const { error: codigosError } = await supabase
    .from("vote_codes")
    .update({
      used: false,
      used_at: null,
    })
    .eq("used", true);

  if (codigosError) {
    alert(codigosError.message);
    return;
  }

  alert("Votação resetada com sucesso!");
  loadCodes();
}
  async function excluirCodigo(id: string) {
    const confirmar = confirm(
      "Deseja excluir este código?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("vote_codes")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setCodes((prev) =>
      prev.filter((c) => c.id !== id)
    );
  }
  function exportarDisponiveis() {
  const csv = [
    ["Código"],
    ...disponiveis.map((c) => [c.code]),
  ]
    .map((row) => row.join(";"))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "codigos-disponiveis.csv";
  link.click();

  URL.revokeObjectURL(url);
}

  async function excluirDisponiveis() {
  const confirmar = confirm(
    "Deseja excluir TODOS os códigos disponíveis?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("vote_codes")
    .delete()
    .eq("used", false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Códigos disponíveis excluídos!");
  loadCodes();
}

async function excluirUtilizados() {
  const confirmar = confirm(
    "Deseja excluir TODOS os códigos utilizados?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("vote_codes")
    .delete()
    .eq("used", true);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Códigos utilizados excluídos!");
  loadCodes();
}

async function excluirTodos() {
  const confirmar = confirm(
    "ATENÇÃO! Isso excluirá TODOS os códigos."
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("vote_codes")
    .delete()
    .neq("id", "");

  if (error) {
    alert(error.message);
    return;
  }

  alert("Todos os códigos foram excluídos!");
  loadCodes();
}

  useEffect(() => {
    loadCodes();
  }, []);

  const totalCodigos = codes.length;

  const usados = codes.filter(
    (c) => c.used
  );

  const disponiveis = codes.filter(
    (c) => !c.used
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-pink-600">
            🔑 Gerenciar Códigos
          </h1>

          <a
            href="/admin"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-bold"
          >
            ← Dashboard
          </a>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white p-5 rounded-3xl shadow-lg border border-pink-200">
            <h2 className="text-gray-500 font-semibold">
              Total
            </h2>

            <p className="text-4xl font-extrabold text-black">
              {totalCodigos}
            </p>
          </div>

          <div className="bg-green-50 p-5 rounded-3xl shadow-lg border border-green-300">
            <h2 className="text-green-700 font-semibold">
              Disponíveis
            </h2>

            <p className="text-4xl font-extrabold text-green-600">
              {disponiveis.length}
            </p>
          </div>

          <div className="bg-red-50 p-5 rounded-3xl shadow-lg border border-red-300">
            <h2 className="text-red-700 font-semibold">
              Utilizados
            </h2>

            <p className="text-4xl font-extrabold text-red-600">
              {usados.length}
            </p>
          </div>

        </div>

        {/* Gerador */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-200 mb-8">

          <h2 className="text-2xl font-bold text-black mb-4">
            Gerar códigos
          </h2>

          <div className="flex gap-4 flex-wrap">

            <input
              type="number"
              value={quantidade}
              min={1}
              onChange={(e) =>
                setQuantidade(
                  Number(e.target.value)
                )
              }
              className="border-2 border-pink-300 rounded-xl p-3 text-black"
            />

            <button
              onClick={gerarCodigos}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              {loading
                ? "GERANDO..."
                : "GERAR CÓDIGOS"}
            </button>
            <button
  onClick={exportarDisponiveis}
  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl"
>
  📊 Exportar Disponíveis
</button>
<button
  onClick={resetarVotacao}
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl"
>
  🔄 Resetar Votação
</button>

          </div>

        </div>
{/* EXCLUSÃO EM MASSA */}
<div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-200 mb-8">

  <h2 className="text-2xl font-bold text-black mb-4">
    Limpeza de códigos
  </h2>

  <div className="flex gap-4 flex-wrap">

    <button
      onClick={excluirDisponiveis}
      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
    >
      🟢 Excluir Disponíveis
    </button>

    <button
      onClick={excluirUtilizados}
      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl"
    >
      🔴 Excluir Utilizados
    </button>

    

  </div>

</div>
        {/* LISTAS */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* DISPONÍVEIS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-green-300">

            <h2 className="text-2xl font-extrabold text-green-600 mb-6">
              🟢 Códigos Disponíveis ({disponiveis.length})
            </h2>

            <div className="space-y-3 max-h-[700px] overflow-y-auto">

              {disponiveis.map((item) => (
                <div
                  key={item.id}
                  className="bg-green-50 border border-green-300 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-extrabold text-xl text-black">
                      {item.code}
                    </h3>

                    <p className="font-bold text-green-600">
                      DISPONÍVEL
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      excluirCodigo(item.id)
                      
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-bold"
                  >
                    🗑️
                  </button>
                  
                </div>
              ))}

            </div>

          </div>

          {/* UTILIZADOS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-red-300">

            <h2 className="text-2xl font-extrabold text-red-600 mb-6">
              🔴 Códigos Utilizados ({usados.length})
            </h2>

            <div className="space-y-3 max-h-[700px] overflow-y-auto">

              {usados.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-50 border border-red-300 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-extrabold text-xl text-black">
                      {item.code}
                    </h3>

                    <p className="font-bold text-red-600">
                      UTILIZADO
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      excluirCodigo(item.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-bold"
                  >
                    🗑️
                  </button>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}