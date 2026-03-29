/**
 * generatePdf.js — Digitalizen Brand PDF Engine v2026
 *
 * Captures a hidden DOM template → jsPDF A4 document.
 * Zero server. Zero upload. Pure client-side.
 *
 * Deps (add to package.json):
 *   "jspdf":       "^2.5.1"
 *   "html2canvas": "^1.4.1"
 */

import jsPDF       from 'jspdf'
import html2canvas from 'html2canvas'

/* ── Constants ─────────────────────────────────── */
const A4_W_MM        = 210
const A4_H_MM        = 297
const ELEMENT_W_PX   = 794   // A4 at 96 dpi
const CANVAS_SCALE   = 2     // 192 dpi → retina-crisp output
const JPEG_QUALITY   = 0.93

/* ─────────────────────────────────────────────────
   generateBrandedPdf
   @param {string} elementId  - id of the hidden template div
   @param {string} filename   - desired .pdf filename
   @returns {Promise<void>}
──────────────────────────────────────────────────*/
export async function generateBrandedPdf(
  elementId,
  filename = 'digitalizen-roadmap.pdf',
) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error(`[generatePdf] #${elementId} not found.`)

  /* Snapshot original inline styles */
  const snap = {
    display:    el.style.display,
    visibility: el.style.visibility,
    position:   el.style.position,
    top:        el.style.top,
    left:       el.style.left,
    width:      el.style.width,
    zIndex:     el.style.zIndex,
  }

  /* Reveal off-screen — paint without layout shift */
  Object.assign(el.style, {
    display:    'block',
    visibility: 'visible',
    position:   'fixed',
    top:        '-9999px',
    left:       '0px',
    width:      `${ELEMENT_W_PX}px`,
    zIndex:     '-1',
  })

  /* Two rAF ticks: layout flush → paint → stable DOM */
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

  try {
    const canvas = await html2canvas(el, {
      scale:           CANVAS_SCALE,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#ffffff',
      logging:         false,
      imageTimeout:    0,
      windowWidth:     ELEMENT_W_PX,
    })

    const pdf   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()   // 210 mm
    const pageH = pdf.internal.pageSize.getHeight()  // 297 mm

    /* Scale canvas → A4 width; derive full image height in mm */
    const scaledH = (canvas.height / canvas.width) * pageW
    const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

    /* Paginate: draw the full-height image, offset by one page per iteration */
    let drawnMm = 0
    let page    = 0
    while (drawnMm < scaledH) {
      if (page > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, -drawnMm, pageW, scaledH)
      drawnMm += pageH
      page++
    }

    pdf.save(filename)
  } finally {
    /* Restore — even on error */
    Object.assign(el.style, snap)
  }
}
