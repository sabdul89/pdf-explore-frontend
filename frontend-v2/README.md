# Docsy — Production-ready Frontend (Next.js)

This is a production-grade frontend for the Docsy app (PDF section selection, coordinate conversion,
drag-resize, multi-select). It uses Next.js + Tailwind + react-pdf and includes a mock detection API for local testing.

## Quickstart

1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Deploy to Vercel

1. Push to a Git repo (GitHub/GitLab)
2. Import the repo on Vercel; it will detect Next.js automatically.
3. (Optional) Add environment variables in Vercel dashboard if you replace the mock API.

## Notes

- The detection API is a mock at `/api/detect`. Replace it with your ML endpoint as needed.
- The app converts viewer pixel coordinates to PDF points (72 DPI) before calling the API.
- This build is optimized for Vercel (includes vercel.json).
