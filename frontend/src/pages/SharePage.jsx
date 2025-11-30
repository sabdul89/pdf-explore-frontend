import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api";

export default function SharePage() {
  const { share_id } = useParams();
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (share_id) {
      // ABSOLUTE link, never relative
      const fullUrl = `${API_BASE}/share/get/${share_id}`;
      setShareUrl(fullUrl);
      setLoading(false);
    }
  }, [share_id]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Your Shareable Link</h2>

      <div className="border rounded p-4 bg-gray-50">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {shareUrl}
        </a>
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(shareUrl)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Copy Link
      </button>
    </div>
  );
}
