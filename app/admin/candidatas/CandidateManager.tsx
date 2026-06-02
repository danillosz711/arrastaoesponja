"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import CandidateForm from "../../../components/CandidateForm";

type Candidate = {
  id: string;
  name: string;
  description: string;
  photo_url: string;
};

export default function CandidateManager() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function loadCandidates() {
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .order("name");
    setCandidates(data || []);
  }

  async function deleteCandidate(id: string) {
    if (!confirm("Deseja realmente excluir esta candidata?")) return;
    await supabase.from("candidates").delete().eq("id", id);
    loadCandidates();
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-b from-pink-50 via-white to-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-pink-600">Candidatas</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg"
        >
          + Nova Candidata
        </button>
      </div>

      {showForm && (
        <CandidateForm
          candidate={editing}
          onSaved={() => {
            setShowForm(false);
            loadCandidates();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl shadow-xl border border-pink-200 overflow-hidden flex flex-col"
          >
            <img
              src={c.photo_url}
              alt={c.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black">{c.name}</h2>
                <p className="text-gray-600 mt-2">{c.description}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-2 rounded-xl shadow"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteCandidate(c.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl shadow"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <p className="text-center text-pink-600 font-bold mt-10">
          Nenhuma candidata cadastrada.
        </p>
      )}
    </div>
  );
}