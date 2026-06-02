"use client";

type MessageModalProps = {
  open: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export default function MessageModal({ open, title, message, buttonText = "OK", onClose }: MessageModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-black mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}