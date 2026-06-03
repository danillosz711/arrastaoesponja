"use client";

import { useRouter } from "next/navigation";

export default function AdminContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function sair() {
  await fetch("/api/admin-logout", {
    method: "POST",
  });

  router.push("/admin-login");
  router.refresh();
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