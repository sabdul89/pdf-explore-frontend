import React, { useState } from "react";
import { API_BASE } from "../api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [error, setError] = useState("");

  // Dynamically detect the correct frontend origin (local, Vercel preview, Vercel production)
  const FRONTEND_BASE =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://pdf-explore-frontend.vercel.app"; // fallback for SSR

  const handleFileUpload = async (e) => {
    setError("");
    setShareLink(null);
    setFields([]);

    const selected = e.target.files[0];
    setFile(selected);

    if (!selected) return;

    const formData = new FormData();
    formData.append("file", selected);

    setLoading(true);

    try {
      console.log("Uploading to:", `${API_BASE}/upload/`);

      const res = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      if (!data.file_id) throw new Error("Invalid file_id in upload response");

      setFileId(data.file_id);

      // Now parse the file
      const parseRes = await fetch(`${API_BASE}/parse/${data.file_id}`);
      if (!parseRes.ok)
        throw new Error(`Parse failed (${parseRes.status})`);

      const parseJson = await parseRes.json();
      console.log("PARSE RESPONSE:", parseJson);

      if (!parseJson.fields || !Array.isArray(parseJson.fields)) {
        throw new Error("No fields extracted or invalid format");
      }

      setFields(parseJson.fields);
    } catch (err) {
      console.error("UPLOAD/PARSE ERROR:", err);
      setError(err.message || "Something went wrong processing the PDF.");
    }

    setLoading(false);
  };

  const handleShare = async () => {
    if (!fileId || fields.length === 0) {
      alert("No fields available to save.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/share/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          fields,
        }),
      });

      const data = await res.json();
      console.log("SHARE CREATE RESPONSE:", data);

      if (!data.share_id) {
        throw new Error("No share_id returned from server");
      }

      // 🔥 ABSOLUTE FULL URL FOR SHARING
      const fullShareUrl = `${FRONTEND_BASE}/share?id=${data.share_id}`;

      setShareLink(fullShareUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate share link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-20 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          PDF Explore — Upload & Parse
        </h1>

        <label className="block font-medium mb-2">Select PDF to upload</label>

        <input type="file" accept="application/pdf" onChange={handleFileUpload} />

        {loading && (
          <p className="mt-4 text-blue-600 font-medium">Processing PDF…</p>
        )}

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {fields.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold mb-4 text-lg">Detected Fields</h2>

            <div className="space-y-4">
              {fields.map((f, idx) => (
                <div key={idx}>
                  <label className="block text-sm mb-1">{f.label}</label>
                  <input
                    className="border w-full rounded p-2"
                    value={f.sample_value || ""}
                    onChange={(e) => {
                      const updated = [...fields];
                      updated[idx].sample_value = e.target.value;
                      setFields(updated);
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              Save & Generate Share Link
            </button>

            {shareLink && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Share this link:</p>
                <a href={shareLink} className="text-blue-600 underline break-all">
                  {shareLink}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

