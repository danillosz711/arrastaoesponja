"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function entrar() {
    setErro("");
    setLoading(true);

    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: senha,
      }),
    });

    const result = await response.json();

    setLoading(false);

    if (!result.success) {
      setErro("Senha inválida");
      return;
    }

    localStorage.setItem("admin_logado", "true");

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Área Administrativa
        </h1>

        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-4"
        />

        <button
          onClick={entrar}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg"
        >
          {loading ? "ENTRANDO..." : "ENTRAR"}
        </button>

        {erro && (
          <p className="text-red-500 mt-4 font-bold">
            {erro}
          </p>
        )}
      </div>
    </main>
  );
}