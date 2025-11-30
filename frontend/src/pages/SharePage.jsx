import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api";

export default function SharePage() {
  const { share_id } = useParams();
  const [absoluteFrontendUrl, setAbsoluteFrontendUrl] = useState("");
  const [absoluteBackendUrl, setAbsoluteBackendUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!share_id) return;

    // FULL absolute frontend link
    const frontendUrl = `${window.location.origin}/share/${share_id}`;
    setAbsoluteFrontendUrl(frontendUrl);

    // FULL absolute backend link
    const backendUrl = `${API_BASE}/share/get/${share_id}`;
    setAbsoluteBackendUrl(backendUrl);

    setLoading(false);
  }, [share_id]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="p-6 max-w-xl mx-auto text-center">

      <h2 className="text-2xl font-bold mb-6">Your Shareable Link</h2>

      {/* Frontend Link */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Frontend Link</h3>
        <div className="border rounded p-4 bg-gray-50">
          <a
            href={absoluteFrontendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {absoluteFrontendUrl}
          </a>
        </div>
      </div>

      {/* Backend Link */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Backend JSON Link</h3>
        <div className="border rounded p-4 bg-gray-50">
          <a
            href={absoluteBackendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {absoluteBackendUrl}
          </a>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={() => navigator.clipboard.writeText(absoluteFrontendUrl)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Copy Frontend Link
      </button>
    </div>
  );
}
