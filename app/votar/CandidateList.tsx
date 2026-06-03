"use client";

import { useState } from "react";
import VoteButton from "./VoteButton";

type Candidate = {
  id: string;
  name: string;
  description: string;
  photo_url: string;
};

export default function CandidateList({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Busca */}
      <div className="max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="🔍 Buscar candidata..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            p-4
            rounded-2xl
            border-2
            border-pink-300
            text-black
            text-lg
            bg-white
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-4
            focus:ring-pink-300
          "
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-xl
              border
              border-pink-100
              hover:scale-[1.02]
              transition-all
              duration-300
              flex
              flex-col
              h-full
            "
          >
            {/* FOTO */}
            <div className="bg-pink-50 p-2">
              <img
                src={candidate.photo_url}
                alt={candidate.name}
                className="
                  w-full
                  h-[450px]
                  object-cover
                  rounded-2xl
                "
              />
            </div>

            {/* CONTEÚDO */}
            <div className="p-6 text-center flex flex-col flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-black">
                {candidate.name}
              </h2>

              <p
                className="
                  text-gray-600
                  mt-3
                  h-24
                  overflow-hidden
                  text-sm
                  md:text-base
                "
              >
                {candidate.description}
              </p>

              {/* BOTÃO SEMPRE ALINHADO */}
              <div className="mt-auto pt-4">
                <VoteButton
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                />
              </div>
            </div>
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="col-span-full text-center text-pink-600 text-2xl font-bold mt-12">
            Nenhuma candidata encontrada.
          </div>
        )}
      </div>
    </>
  );
}