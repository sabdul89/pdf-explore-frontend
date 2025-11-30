import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api";

export default function SharePage() {
  const { share_id } = useParams();
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (share_id) {
      // Always generate absolute link from frontend domain
      const fullUrl = `${API_BASE}/share/get/${share_id}`;
      setShareUrl(fullUrl);
      setLoading(false);
    }
  }, [share_id]);

  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading…</div>;

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">
        Your Shareable Link
      </h2>

      <div className="border rounded-lg p-4 bg-gray-50">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all text-lg"
        >
          {shareUrl}
        </a>
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(shareUrl)}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Copy Link
      </button>
    </div>
  );
}
