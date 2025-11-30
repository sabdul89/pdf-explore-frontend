import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExtractedFields } from "../api";

export default function SharePage() {
  const [params] = useSearchParams();
  const fileId = params.get("id");
  const [fields, setFields] = useState(null);

  useEffect(()=>{
    if(fileId){
      getExtractedFields(fileId).then(data=>setFields(data.fields));
    }
  },[fileId]);

  if(!fileId) return <div>No fileId provided.</div>;
  if(!fields) return <div>Loading...</div>;

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Fill This Form</h1>

      {fields.map(f=>(
        <div key={f.key} className="mb-3">
          <label className="block text-gray-600">{f.label}</label>
          <input className="border p-2 w-full" defaultValue={f.sample_value} />
        </div>
      ))}
    </div>
  );
}
