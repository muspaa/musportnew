export type WorkStatus = 'LIVE_VERIFIED' | 'ONLINE_UNVERIFIED' | 'ARCHIVED' | 'CONCEPT' | 'RECOVERED';
/** Tampilan planet untuk satu proyek: hue utama, hue kedua, cincin, dan simbol. */
export interface PlanetTheme { hue: number; hue2: number; ring: boolean; glyph: string }
export interface Project {
  id: string; name: string; category: string; url: string;
  description: string; summary: string; problem: string; exploration: string; outcome: string;
  ecosystem: string[]; status: WorkStatus; type: 'work' | 'experiment' | 'prototype'; visualType: 'real' | 'illustrative' | 'placeholder';
  theme: PlanetTheme;
}
export interface JourneyStep { phase: string; title: string; subtitle: string; description: string; techKeywords: string[]; environment?: { device?: string; laptop?: string; learning?: string } }
export interface EcosystemGroup { category: string; items: { name: string; description: string; iconName: string }[] }
export interface Certificate { id: string; title: string; issuer: string; year: string; category: string; image?: string; url?: string; note?: string; demo?: boolean }
