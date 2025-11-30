/**
 * Convert section drawn in screen pixels to PDF points.
 * pageDims: { width, height } in PDF points (e.g., 612x792)
 * renderedDims: { width, height } in CSS pixels
 * section: { x, y, width, height } in CSS pixels
 */
export function convertToPdfPoints(section, pageDims, renderedDims) {
  const scaleX = pageDims.width / renderedDims.width;
  const scaleY = pageDims.height / renderedDims.height;
  return {
    page: section.page,
    x: Math.round(section.x * scaleX),
    y: Math.round(section.y * scaleY),
    width: Math.round(section.width * scaleX),
    height: Math.round(section.height * scaleY),
  };
}
