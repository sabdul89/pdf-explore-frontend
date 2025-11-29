import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'https://pdf-explore.onrender.com'

export async function uploadFile(file){
  const fd = new FormData()
  fd.append('file', file)
  const res = await axios.post(`${BASE}/upload/`, fd, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
  return res.data
}

export async function parseFile(file_id){
  const res = await axios.get(`${BASE}/parse/${file_id}`)
  return res.data
}

export async function fillFile(file_id, values){
  const res = await axios.post(`${BASE}/fill/${file_id}`, values)
  return res.data
}

export async function createShare(file_id){
  const res = await axios.post(`${BASE}/share/create/${file_id}`)
  return res.data
}
