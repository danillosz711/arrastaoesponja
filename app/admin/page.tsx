import { supabase } from "../../lib/supabase";
import AdminContent from "./AdminContent";

export default async function AdminPage() {
  const { data: votes } = await supabase
    .from("votes")
    .select("id, candidate_id");

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*");

  const ranking =
    candidates?.map((candidate) => ({
      ...candidate,
      votos:
        votes?.filter(
          (vote) => vote.candidate_id === candidate.id
        ).length || 0,
    })) || [];

  ranking.sort((a, b) => b.votos - a.votos);

  const totalVotos = votes?.length || 0;

  return (
    <AdminContent>
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-5xl font-bold text-center mb-10">
            Dashboard Admin - Gata do Esponja
          </h1>

          {/* Cards superiores */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-zinc-900 p-6 rounded-xl text-center shadow-md">
              <p className="text-zinc-400">Total de votos</p>
              <h2 className="text-3xl font-bold">{totalVotos}</h2>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl text-center shadow-md">
              <p className="text-zinc-400">Candidatas</p>
              <h2 className="text-3xl font-bold">{candidates?.length || 0}</h2>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl text-center shadow-md">
              <p className="text-zinc-400">Líder Atual</p>
              <h2 className="text-2xl font-bold">{ranking[0]?.name || "-"}</h2>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl text-center shadow-md">
              <p className="text-zinc-400">Status da Votação</p>
              <h2 className="text-green-500 font-bold">Aberta</h2>
            </div>
          </div>

          {/* Ranking Top 5 */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-pink-500 text-center mb-6">🏆 Top 5 Mais Votadas</h2>
            {ranking.slice(0, 5).map((candidate, index) => {
              const porcentagem = totalVotos > 0 ? ((candidate.votos / totalVotos) * 100).toFixed(1) : 0;
              return (
                <div
                  key={candidate.id}
                  className="bg-zinc-900 rounded-xl p-4 mb-4 flex items-center gap-4 hover:scale-105 transform transition-all"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-yellow-400 to-pink-500 shadow-lg">
                      <img
                        src={candidate.photo_url}
                        alt={candidate.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <span className="absolute -top-2 -left-2 text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-bold">{candidate.name}</h3>
                      <span className="text-pink-500 font-bold">{candidate.votos} voto(s)</span>
                    </div>
                    <div className="w-full bg-pink-100 rounded-full h-4 overflow-hidden">
                      <div className="bg-pink-500 h-4 rounded-full" style={{ width: `${porcentagem}%` }} />
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{porcentagem}% dos votos</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de gerenciamento */}
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/admin/candidatas"
              className="bg-pink-500 hover:bg-pink-600 p-5 rounded-xl text-center font-bold transition-all"
            >
              👑 Gerenciar Candidatas
            </a>
            <a
              href="/admin/codigos"
              className="bg-blue-500 hover:bg-blue-600 p-5 rounded-xl text-center font-bold transition-all"
            >
              🔑 Gerenciar Códigos
            </a>
            <a
              href="/admin/admins"
              className="bg-green-500 hover:bg-green-600 p-5 rounded-xl text-center font-bold transition-all"
            >
              👤 Administradores
            </a>
            <a
              href="/admin/configuracoes"
              className="bg-purple-500 hover:bg-purple-600 p-5 rounded-xl text-center font-bold transition-all"
            >
              ⚙️ Configurações
            </a>
          </div>
        </div>
      </main>
    </AdminContent>
  );
}
<a
  href="/admin/codigos"
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold"
>
  🔑 Gerenciar Códigos
</a>
import { jsPDF } from "jspdf";

function exportRankingPDF(candidates: any[]) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("🏆 Ranking Gata do Esponja", 20, 20);

  doc.setFontSize(16);

  candidates.forEach((c, index) => {
    const y = 40 + index * 12;
    doc.text(`${index + 1}º - ${c.name} - ${c.votos} votos`, 20, y);
  });

  doc.save("ranking.pdf");
}

