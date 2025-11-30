/**
 * Mock detection endpoint.
 * Expects body: { pdfRegions: [{page,x,y,width,height}, ...] } where coords are PDF points.
 * Returns synthetic fields within each region for demo purposes.
 */
export default async function handler(req, res) {
  const { pdfRegions } = req.body || {};
  const fields = (pdfRegions || []).flatMap((r, i) => [
    { id: `f_${i}_1`, page: r.page, x: r.x + 20, y: r.y + 40, width: Math.min(200, r.width - 40), height: 24, type: 'text', name: `field_${i}_name` },
    { id: `f_${i}_2`, page: r.page, x: r.x + 20, y: r.y + 80, width: Math.min(160, r.width - 40), height: 24, type: 'date', name: `field_${i}_date` },
  ]);
  await new Promise(r => setTimeout(r, 450));
  res.status(200).json({ fields });
}
