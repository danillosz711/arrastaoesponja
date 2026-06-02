"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const logado = localStorage.getItem("admin_logado");

    if (logado !== "true") {
      router.push("/admin-login");
      return;
    }

    setAutorizado(true);
  }, [router]);

  function sair() {
    localStorage.removeItem("admin_logado");
    router.push("/admin-login");
  }

  if (!autorizado) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl">
          Verificando acesso...
        </h1>
      </main>
    );
  }

  return (
    <>
      <div className="bg-black p-4 flex justify-end">
        <button
          onClick={sair}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          SAIR
        </button>
      </div>

      {children}
    </>
  );
}