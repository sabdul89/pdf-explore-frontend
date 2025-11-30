import { useState } from "react";
import { uploadFile, getExtractedFields } from "../api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState(null);
  const [shareLink, setShareLink] = useState("");

  const handleUpload = async () => {
    const form = new FormData();
    form.append("file", file);

    const res = await uploadFile(form);
    const extracted = await getExtractedFields(res.file_id);
    setFields(extracted.fields);

    setShareLink(window.location.origin + "/share?id=" + res.file_id);
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF Explore — Upload & Parse</h1>

      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
      <button className="mt-4 p-2 bg-blue-500 text-white" onClick={handleUpload}>
        Upload & Parse
      </button>

      {fields && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Detected Fields</h2>
          {fields.map(f=>(
            <div key={f.key} className="mb-3">
              <label className="block text-gray-600">{f.label}</label>
              <input className="border p-2 w-full" defaultValue={f.sample_value} />
            </div>
          ))}
        </div>
      )}

      {shareLink && (
        <div className="mt-4 p-3 bg-gray-100">
          <p className="text-sm">Share:</p>
          <a className="text-blue-600" href={shareLink}>{shareLink}</a>
        </div>
      )}
    </div>
  );
}
