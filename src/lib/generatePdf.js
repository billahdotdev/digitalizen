/**
 * generatePdf.js — Digitalizen Brand PDF Engine v2026.6
 *
 * Discrete A4 Page Architecture:
 * Each page is captured separately as a DOM node → jsPDF.
 * Zero blind slicing. Zero mid-text cuts. Pure page-by-page control.
 *
 * Deps:
 *   "jspdf":       "^2.5.1"
 *   "html2canvas": "^1.4.1"
 */

import jsPDF       from 'jspdf'
import html2canvas from 'html2canvas'

/* ── Constants ─────────────────────────────────── */
const ELEMENT_W_PX  = 794    // A4 at 96 dpi  (210mm)
const ELEMENT_H_PX  = 1122   // A4 at 96 dpi  (297mm)
const CANVAS_SCALE  = 2      // 192 dpi → retina-crisp
const JPEG_QUALITY  = 0.93

export async function generateBrandedPdf(
  containerElementId,
  filename = 'digitalizen-roadmap.pdf',
) {
  const container = document.getElementById(containerElementId)
  if (!container) throw new Error(`[generatePdf] #${containerElementId} not found.`)

  const pages = Array.from(container.querySelectorAll('.fpl-a4-page'))
  if (pages.length === 0) {
    throw new Error('[generatePdf] No .fpl-a4-page elements found.')
  }

  /* Snapshot inline styles so we can fully restore on exit */
  const snap = {
    display:    container.style.display,
    visibility: container.style.visibility,
    position:   container.style.position,
    top:        container.style.top,
    left:       container.style.left,
    width:      container.style.width,
    zIndex:     container.style.zIndex,
  }

  /* Reveal off-screen — no layout shift on the visible page */
  Object.assign(container.style, {
    display:    'block',
    visibility: 'visible',
    position:   'fixed',
    top:        '-9999px',
    left:       '0px',
    width:      `${ELEMENT_W_PX}px`,
    zIndex:     '-1',
  })

  /* ── CRITICAL FIX 1 ─────────────────────────────
     Await font loading BEFORE any capture.
     Without this, Hind Siliguri / Noto Sans Bengali
     may still be downloading, causing html2canvas to
     fall back to a system font → Bengali text renders
     as boxes or wrong glyphs in the PDF.
  ─────────────────────────────────────────────────── */
  await document.fonts.ready

  /* Two rAF ticks: layout flush → paint → stable DOM */
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

  const pdf   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()   // 210 mm

  try {
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale:           CANVAS_SCALE,
        useCORS:         true,
        allowTaint:      false,
        backgroundColor: '#ffffff',
        logging:         false,
        imageTimeout:    0,
        /* ── CRITICAL FIX 2 ────────────────────────
           Pass explicit viewport dimensions.
           Without windowHeight, html2canvas measures
           the full document height as the viewport —
           which can cause incorrect clipping or scroll
           offset bugs on long pages.
        ─────────────────────────────────────────────── */
        windowWidth:     ELEMENT_W_PX,
        windowHeight:    ELEMENT_H_PX,
      })

      const scaledH = (canvas.height / canvas.width) * pageW
      const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, scaledH)
    }

    pdf.save(filename)
  } finally {
    /* Restore container — even on error */
    Object.assign(container.style, snap)
  }
}
