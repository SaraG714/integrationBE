"use client";

import { useState, useRef } from "react";
import { uploadFiles } from "@/lib/uploadthing";
import Toast from "@/components/Toast";

type Tab = "post" | "reel";

export default function CreatePage() {
  const [tab, setTab] = useState<Tab>("post");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [audioTrack, setAudioTrack] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const endpoint = tab === "post" ? "imageUploader" : "videoUploader";
      const [result] = await uploadFiles(endpoint, { files: [file] });
      setUploadedUrl(result.ufsUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadedUrl) { setError("Esperá que termine de subir el archivo."); return; }

    setLoading(true);
    setError(null);

    try {
      if (tab === "post") {
        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl, caption, location }),
        });
        setToast("Post creado con éxito");
      } else {
        await fetch("/api/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: uploadedUrl, thumbnailUrl: uploadedUrl, caption, audioTrack }),
        });
        setToast("Reel creado con éxito");
      }

      setUploadedUrl(null);
      setPreview(null);
      setCaption("");
      setLocation("");
      setAudioTrack("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <h1 className="text-xl font-bold mb-6">Create new {tab}</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["post", "reel"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setUploadedUrl(null); setPreview(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* File picker */}
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
        >
          {preview ? (
            <div className="relative w-full h-full">
              {tab === "post" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <video src={preview} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white font-semibold text-sm">Subiendo…</p>
                </div>
              )}
              {!uploading && uploadedUrl && (
                <button
                  type="button"
                  onClick={(ev) => { ev.stopPropagation(); setUploadedUrl(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400 p-8 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="font-semibold text-sm">Click para seleccionar un archivo</p>
              <p className="text-xs">{tab === "post" ? "JPEG, PNG, WEBP" : "MP4, MOV"}</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={tab === "post" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-blue-400 transition-colors"
            required
          />
        </div>

        {tab === "post" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add a location"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {tab === "reel" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Audio track (optional)</label>
            <input
              type="text"
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              placeholder="e.g. Golden Hour — JVKE"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading || uploading || !caption.trim() || !uploadedUrl}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40"
        >
          {uploading ? "Subiendo archivo…" : loading ? "Sharing…" : `Share ${tab}`}
        </button>
      </form>
    </div>
  );
}
