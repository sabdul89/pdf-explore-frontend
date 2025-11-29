import React, {useState} from 'react'
import { uploadFile, parseFile } from '../api'
import FieldEditor from '../components/FieldEditor'

export default function UploadPage(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileId, setFileId] = useState(null)
  const [schema, setSchema] = useState(null)

  async function handleUpload(e){
    const f = e.target.files[0]
    if(!f) return
    setFile(f)
    setLoading(true)
    try{
      const upl = await uploadFile(f)
      setFileId(upl.file_id)
      // auto-parse after upload
      const parsed = await parseFile(upl.file_id)
      setSchema(parsed.json_schema || parsed.schema_json || parsed)
    }catch(err){
      alert(err?.response?.data?.detail || err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="block mb-2 text-sm font-medium">Select PDF to upload</label>
      <input type="file" accept="application/pdf" onChange={handleUpload} className="mb-4" />
      {loading && <div className="text-sm text-gray-500">Uploading & parsing...</div>}
      {schema && fileId && (
        <div className="mt-6">
          <FieldEditor fileId={fileId} schema={schema} />
        </div>
      )}
    </div>
  )
}
