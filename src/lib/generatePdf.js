/**
 * generatePdf.js — Digitalizen Brand PDF Engine v2026.5
 *
 * Discrete A4 Page Architecture:
 * Each page is captured separately as a DOM node → jsPDF.
 * Zero blind slicing. Zero mid-text cuts. Pure page-by-page control.
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
   @param {string} containerElementId - id of the hidden template container
   @param {string} filename           - desired .pdf filename
   @returns {Promise<void>}

   Architecture:
   1. Find all .fpl-a4-page elements inside the container
   2. For each page:
      - Reveal off-screen
      - Capture with html2canvas
      - Add to jsPDF as discrete page
   3. Save as single PDF with perfect page breaks
──────────────────────────────────────────────────*/
export async function generateBrandedPdf(
  containerElementId,
  filename = 'digitalizen-roadmap.pdf',
) {
  const container = document.getElementById(containerElementId)
  if (!container) throw new Error(`[generatePdf] #${containerElementId} not found.`)

  // Find all A4 page blocks
  const pages = Array.from(container.querySelectorAll('.fpl-a4-page'))
  if (pages.length === 0) {
    throw new Error('[generatePdf] No .fpl-a4-page elements found. Check FinderPdfLayer structure.')
  }

  /* Snapshot original container inline styles */
  const containerSnap = {
    display:    container.style.display,
    visibility: container.style.visibility,
    position:   container.style.position,
    top:        container.style.top,
    left:       container.style.left,
    width:      container.style.width,
    zIndex:     container.style.zIndex,
  }

  /* Reveal container off-screen — paint without layout shift */
  Object.assign(container.style, {
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

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()   // 210 mm
  const pageH = pdf.internal.pageSize.getHeight()  // 297 mm

  try {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]

      // Capture this specific page
      const canvas = await html2canvas(page, {
        scale:           CANVAS_SCALE,
        useCORS:         true,
        allowTaint:      false,
        backgroundColor: '#ffffff',
        logging:         false,
        imageTimeout:    0,
        windowWidth:     ELEMENT_W_PX,
      })

      // Scale canvas → A4 dimensions
      const scaledH = (canvas.height / canvas.width) * pageW
      const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

      // Add new page if not first
      if (i > 0) pdf.addPage()

      // Add image — fit to A4 page
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, scaledH)
    }

    pdf.save(filename)
  } finally {
    /* Restore container — even on error */
    Object.assign(container.style, containerSnap)
  }
}
