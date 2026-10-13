import data from '../shared/content.json';
import type { Project, JourneyStep, EcosystemGroup } from './types';
export const PROJECTS = data.PROJECTS as Project[];
export const JOURNEY_STEPS = data.JOURNEY_STEPS as JourneyStep[];
export const ECOSYSTEM = data.ECOSYSTEM as EcosystemGroup[];
export { default as PROFILE } from '../shared/profile.json';
export const statusLabels: Record<string, string> = { LIVE_VERIFIED: 'Demo terverifikasi', ONLINE_UNVERIFIED: 'Tautan belum diverifikasi', ARCHIVED: 'Arsip', CONCEPT: 'Konsep', RECOVERED: 'Ditemukan kembali' };
