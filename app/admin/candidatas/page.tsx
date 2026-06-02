import AdminContent from "../AdminContent";
import CandidateManager from "./CandidateManager";

export default function CandidatasPage() {
  return (
    <AdminContent>
      <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-pink-600 mb-10">
            Gerenciar Candidatas
          </h1>

          <CandidateManager />
        </div>
      </main>
    </AdminContent>
  );
}