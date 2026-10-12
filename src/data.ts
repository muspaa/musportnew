import data from '../shared/content.json';
import certificateData from '../shared/certificates.json';
import type { Project, JourneyStep, EcosystemGroup, Certificate } from './types';
export const PROJECTS = data.PROJECTS as Project[];
export const JOURNEY_STEPS = data.JOURNEY_STEPS as JourneyStep[];
export const ECOSYSTEM = data.ECOSYSTEM as EcosystemGroup[];
export { default as PROFILE } from '../shared/profile.json';
export const CERTIFICATE_CATEGORIES = certificateData.categories as string[];
const real = certificateData.items as Certificate[];
/** Sertifikat asli tampil sendiri; contoh berlabel hanya muncul selama daftar asli masih kosong. */
export const CERTIFICATES: Certificate[] = real.length ? real : (certificateData.samples as Certificate[]).map(c => ({ ...c, demo: true }));
export const HAS_REAL_CERTIFICATES = real.length > 0;
export const statusLabels: Record<string, string> = { LIVE_VERIFIED: 'Demo terverifikasi', ONLINE_UNVERIFIED: 'Tautan belum diverifikasi', ARCHIVED: 'Arsip', CONCEPT: 'Konsep', RECOVERED: 'Ditemukan kembali' };
