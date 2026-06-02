"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type Candidate = {
  id?: string;
  name: string;
  description: string;
  photo_url: string;
};

export default function CandidateForm({
  candidate,
  onSaved,
}: {
  candidate?: Candidate | null;
  onSaved: () => void;
}) {
  const [name, setName] = useState(candidate?.name || "");
  const [description, setDescription] = useState(candidate?.description || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(candidate?.photo_url || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let photo_url = photoPreview;

    try {
      if (photo) {
        const fileName = `${Date.now()}-${photo.name}`;

        const { error: uploadError } = await supabase.storage
          .from("candidates")
          .upload(fileName, photo, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("candidates").getPublicUrl(fileName);
        photo_url = data.publicUrl;
      }

      if (candidate?.id) {
        const { error } = await supabase
          .from("candidates")
          .update({ name, description, photo_url })
          .eq("id", candidate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("candidates")
          .insert({ name, description, photo_url });

        if (error) throw error;
      }

      alert("Candidata salva com sucesso!");
      onSaved();
    } catch (err: any) {
      alert("Erro: " + err.message);
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl shadow-2xl border border-pink-200 max-w-2xl mx-auto mb-10"
    >
      <h2 className="text-3xl font-extrabold text-pink-600 text-center mb-8">
        {candidate ? "✏️ Editar Candidata" : "👑 Nova Candidata"}
      </h2>

      <div className="mb-4">
        <label className="block text-black font-bold mb-2">Nome</label>
        <input
          type="text"
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-2xl border-2 border-pink-300 text-black bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-200"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-black font-bold mb-2">Descrição</label>
        <textarea
          placeholder="Digite uma descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-2xl border-2 border-pink-300 text-black bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-200"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-black font-bold mb-2">Foto da candidata</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPhoto(e.target.files[0]);
              setPhotoPreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
          className="w-full p-3 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 text-black"
        />
      </div>

      {photoPreview && (
        <div className="flex justify-center mb-6">
          <img
            src={photoPreview}
            alt="Preview"
            className="w-52 h-52 object-cover rounded-3xl border-4 border-pink-300 shadow-xl"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg hover:scale-105 transition-all"
      >
        {loading ? "SALVANDO..." : "💾 SALVAR CANDIDATA"}
      </button>
    </form>
  );
}