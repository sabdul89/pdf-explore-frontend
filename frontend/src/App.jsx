import React from 'react'
import UploadPage from './pages/UploadPage'

export default function App(){ 
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">PDF Explore — Upload & Parse</h1>
        <UploadPage />
      </div>
    </div>
  )
}
