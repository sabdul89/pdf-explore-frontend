import React, {useState} from 'react'
import { fillFile, createShare } from '../api'

export default function FieldEditor({fileId, schema}){
  const props = schema.properties || {}
  const initial = Object.fromEntries(Object.keys(props).map(k=>[k, props[k].default || '']))
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)

  function onChange(k,v){ setValues(prev=>({...prev,[k]: v})) }

  async function handleSave(){
    setSaving(true)
    try{
      await fillFile(fileId, values)
      const share = await createShare(fileId)
      setShareUrl(share.share_url)
      alert('Saved and generated share link')
    }catch(err){
      alert(err?.response?.data?.detail || err.message)
    }finally{
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Detected fields</h2>
      <div className="space-y-3">
        {Object.keys(props).map((k)=> (
          <div key={k} className="flex items-start space-x-3">
            <label className="w-40 text-sm font-medium text-gray-700">{props[k].title || k}</label>
            <input className="flex-1 border p-2 rounded" value={values[k]||''} onChange={(e)=>onChange(k,e.target.value)} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave} disabled={saving}>
          {saving? 'Saving...' : 'Save & Generate Share Link'}
        </button>
      </div>
      {shareUrl && <div className="mt-3 text-sm">Share: <a href={shareUrl} className="text-blue-600">{shareUrl}</a></div>}
    </div>
  )
}
