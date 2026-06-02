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

  useEffect(() => {
    loadCodes();
  }, []);

  const totalCodigos = codes.length;

  const usados = codes.filter(
    (c) => c.used
  ).length;

  const disponiveis = totalCodigos - usados;

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
              {disponiveis}
            </p>
          </div>

          <div className="bg-red-50 p-5 rounded-3xl shadow-lg border border-red-300">
            <h2 className="text-red-700 font-semibold">
              Utilizados
            </h2>

            <p className="text-4xl font-extrabold text-red-600">
              {usados}
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

          </div>

        </div>

        {/* Lista */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-200">

          <h2 className="text-2xl font-bold text-black mb-6">
            Lista de códigos
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

            {codes.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border shadow-md ${
                  item.used
                    ? "bg-red-50 border-red-300"
                    : "bg-green-50 border-green-300"
                }`}
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="font-extrabold text-xl text-black">
                      {item.code}
                    </h3>

                    <p
                      className={`font-bold ${
                        item.used
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.used
                        ? "UTILIZADO"
                        : "DISPONÍVEL"}
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
              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
  
}
