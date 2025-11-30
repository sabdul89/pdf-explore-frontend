import React, { useState } from "react";
import { API_BASE } from "../api";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [fileName, setFileName] = useState("");
  const [shareId, setShareId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setShareId("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch(`${API_BASE}/upload/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.file_name) setFileName(data.file_name);
    if (data.fields) setFields(data.fields);
    if (data.share_id) setShareId(data.share_id);
  };

  // ALWAYS front-end controlled absolute link
  const absoluteShareUrl =
    shareId ? `${window.location.origin}/share/${shareId}` : "";

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        PDF Explore — Upload & Parse
      </h1>

      {/* Upload section */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">
          Select PDF to upload
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border rounded p-2 w-full"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Save & Generate Share Link"}
      </button>

      {/* Parsed fields */}
      {fields.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Detected fields
          </h2>

          {fields.map((f, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm mb-1 text-gray-600 font-medium">
                {f.label}
              </label>
              <input
                className="border rounded w-full p-2"
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
      )}

      {/* Absolute Share Link */}
      {shareId && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-600 mb-1 font-medium">Share:</p>

          <a
            href={absoluteShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all text-lg"
          >
            {absoluteShareUrl}
          </a>

          <button
            className="mt-4 px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
            onClick={() => navigator.clipboard.writeText(absoluteShareUrl)}
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
