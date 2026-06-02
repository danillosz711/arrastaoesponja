"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";

export default function VoteButton({
  candidateId,
  candidateName,
}: {
  candidateId: string;
  candidateName: string;
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  const [messageTitle, setMessageTitle] = useState("");
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(false);

  function showMessage(title: string, message: string) {
    setMessageTitle(title);
    setMessageText(message);
    setOpenMessage(true);
  }

  async function confirmarVoto() {
    setOpenConfirm(false);
    setLoading(true);

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      showMessage("Acesso negado", "Código não encontrado.");
      setLoading(false);
      return;
    }

    const { data: voteCode } = await supabase
      .from("vote_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (!voteCode) {
      showMessage("Código inválido", "O código informado não existe.");
      setLoading(false);
      return;
    }

    if (voteCode.used) {
      showMessage("Código já utilizado", "Este código já foi utilizado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("votes")
      .insert({ candidate_id: candidateId, code_id: voteCode.id });

    if (error) {
      showMessage("Erro", error.message);
      setLoading(false);
      return;
    }

    await supabase.from("vote_codes").update({ used: true }).eq("id", voteCode.id);

    // Mensagem de sucesso
    setMessageTitle("✅ Voto registrado");
    setMessageText(`Seu voto para "${candidateName}" foi computado com sucesso!`);
    setOpenMessage(true);
    setLoading(false);

    // Redirecionamento automático após 2 segundos
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }

  function fecharMensagem() {
    setOpenMessage(false);
  }

  return (
    <>
      <button
        onClick={() => setOpenConfirm(true)}
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-extrabold text-lg py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
      >
        {loading ? "VOTANDO..." : "🗳️ VOTAR AGORA"}
      </button>

      <ConfirmModal
        open={openConfirm}
        title="Confirmar voto"
        message={`Tem certeza que deseja votar em "${candidateName}"?`}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={confirmarVoto}
      />

      <MessageModal
        open={openMessage}
        title={messageTitle}
        message={messageText}
        onClose={fecharMensagem}
      />
    </>
  );
}