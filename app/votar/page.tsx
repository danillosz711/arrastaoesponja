import { supabase } from "../../lib/supabase";
import CandidateList from "./CandidateList";

export default async function VotarPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Acesso negado
          </h1>
          <p className="text-gray-600">
            Você precisa informar um código válido.
          </p>
        </div>
      </main>
    );
  }

  const { data: voteCode } = await supabase
    .from("vote_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (!voteCode || voteCode.used) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Código inválido ou já utilizado
          </h1>
          <p className="text-gray-600">
            Informe um código válido para acessar a votação.
          </p>
        </div>
      </main>
    );
  }

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Botão Página Inicial */}
        <div className="mb-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-300"
          >
            ← Página Inicial
          </a>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo-arrastao.jpg"
            alt="Arrastão do Esponja"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-pink-600 mb-2">
          Gata do Esponja
        </h1>

        <p className="text-center text-gray-700 text-base md:text-lg mb-6">
          Escolha sua candidata favorita e registre seu voto.
        </p>

        {/* Aviso ⚠️ */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border-l-8 border-pink-500">
            <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600 mb-4">
              ⚠️ Aviso
            </h2>

            <p className="text-gray-700 text-lg mb-3">
              Vote com consciência e divirta-se! 😄
            </p>

            <p className="text-gray-700 mb-3">
              Lembre-se: <strong>cada código dá direito a apenas 1 voto</strong>.
            </p>

            <p className="text-gray-700 mb-3">
              Esta votação é apenas para entretenimento e interação. O resultado representa a preferência dos votantes e não define o valor, a beleza ou a importância de nenhuma candidata.
            </p>

            <p className="font-semibold text-pink-600">
              Respeite todas as participantes e boa votação! 🎉
            </p>
          </div>
        </div>

        <CandidateList candidates={candidates || []} />

      </div>
    </main>
  );
}