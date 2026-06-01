import React from 'react';

/* ────────────────────────────────────────────────────────────────────
   Icons.jsx — every glyph in the app is here, inline SVG, zero deps.
   Sized via width/height props. Coloured by currentColor by default.
   No icon fonts. No images. No emoji.
   ──────────────────────────────────────────────────────────────────── */

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

export const IconWhatsApp = ({ width = 16, height = 16, fill = 'currentColor', ...p }) => (
  <svg viewBox="0 0 24 24" width={width} height={height} fill={fill} aria-hidden="true" focusable="false" {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const IconCheck = (p) => (
  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true" focusable="false" {...p}>
    <path d="M2 6l3 3 5-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Solid filled circle around a check. Used by the form success card. */
export const IconCheckCircle = ({ width = 36, height = 36, ...p }) => (
  <svg viewBox="0 0 24 24" width={width} height={height} aria-hidden="true" focusable="false" {...p}>
    <circle cx="12" cy="12" r="10" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-6" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconBolt = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true" focusable="false" {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconClose = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export const IconSend = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...baseProps} strokeWidth="2.5" {...p}>
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

/* Process step icons. Replace the four emoji glyphs once used here. */
export const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const IconBuild = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V8l7-5 7 5v13" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 12h6" />
  </svg>
);

export const IconRocket = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const IconBot = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...baseProps} {...p}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 3v5" />
    <circle cx="9" cy="14" r="1.2" fill="currentColor" />
    <circle cx="15" cy="14" r="1.2" fill="currentColor" />
    <path d="M9 18h6" />
  </svg>
);

/* External link arrow for live preview buttons. */
export const IconExternal = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...baseProps} {...p}>
    <path d="M14 3h7v7" />
    <path d="M21 3l-9 9" />
    <path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </svg>
);

/* GitHub octocat outline. */
export const IconGithub = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.97 10.97 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.63 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.13v3.16c0 .3.21.66.8.55 4.56-1.53 7.85-5.84 7.85-10.91C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

/* Warning glyph for the SpeedTest error banner. */
export const IconWarn = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...baseProps} {...p}>
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);

/* WhatsApp double tick read receipt. */
export const IconDoubleTick = (p) => (
  <svg viewBox="0 0 18 11" width="16" height="11" aria-hidden="true" focusable="false" {...p}>
    <path d="M11.5 1 L5.7 9.5 L2 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16   1 L10.2 9.5 L6.5 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Arrow right used in CTAs. */
export const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...baseProps} {...p}>
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

/* Arrow down used to suggest scroll. */
export const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...baseProps} {...p}>
    <path d="M12 5v14" />
    <path d="M5 13l7 7 7-7" />
  </svg>
);
