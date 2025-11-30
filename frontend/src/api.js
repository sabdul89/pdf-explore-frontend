const API_BASE = import.meta.env.VITE_API_BASE;

export async function uploadFile(formData) {
  const res = await fetch(`${API_BASE}/upload/`, {
    method: "POST",
    body: formData
  });
  return res.json();
}

export async function getExtractedFields(fileId) {
  const res = await fetch(`${API_BASE}/extract/${fileId}`);
  return res.json();
}
