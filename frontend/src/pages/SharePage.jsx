import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function SharePage() {
  const [shareId, setShareId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Dynamically detect the correct frontend base URL (local, Vercel, etc.)
  const FRONTEND_BASE =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://pdf-explore-frontend.vercel.app";

  // Parse ?id=<share_id> from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      setError("Invalid share link — missing ID.");
      setLoading(false);
      return;
    }

    setShareId(id);
  }, []);

  // Fetch shared form data
  useEffect(() => {
    if (!shareId) return;

    const fetchShared = async () => {
      try {
        const res = await fetch(`${API_BASE}/share/get/${shareId}`);

        if (!res.ok) {
          throw new Error(`Failed to load shared data (${res.status})`);
        }

        const json = await res.json();
        console.log("SHARE GET RESPONSE:", json);

        if (!json.fields || !Array.isArray(json.fields)) {
          throw new Error("Shared data has no fields or invalid format.");
        }

        if (!json.file_id) {
          throw new Error("Shared link missing file_id.");
        }

        setFields(json.fields);
        setFileId(json.file_id);
      } catch (err) {
        console.error(err);
        setError("This share link may be invalid or expired.");
      }

      setLoading(false);
    };

    fetchShared();
  }, [shareId]);

  // Submit filled fields → download final PDF
  const handleDownload = async () => {
    if (!fileId) {
      alert("Cannot fill PDF — missing file reference.");
      return;
    }

    setDownloading(true);

    try {
      const res = await fetch(`${API_BASE}/fill/${fileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });

      if (!res.ok) {
        throw new Error(`Fill failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "filled.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate filled PDF.");
    }

    setDownloading(false);
  };

  // UI states
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading shared form…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-20 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Fill Shared PDF Form
        </h1>

        <div className="space-y-6">
          {fields.map((f, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">
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

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-8 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {downloading ? "Generating PDF…" : "Download Filled PDF"}
        </button>

        {/* Footer with absolute share link for debugging */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Share page URL:</p>
          <p className="break-all">
            {`${FRONTEND_BASE}/share?id=${shareId}`}
          </p>
        </div>
      </div>
    </div>
  );
}
