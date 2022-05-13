import join from 'url-join';

export const BASE_URL = (import.meta.env.BASE_URL as string) || (import.meta.env.VERCEL_URL as string);
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || join(BASE_URL, 'api');

export const POLL_INTERVAL_MINUTES = Number(import.meta.env.POLL_INTERVAL_MINUTES) || 5;
export const POLL_INTERVAL_MILLISEC = POLL_INTERVAL_MINUTES * 60_000;

export const LEVEL_1_ID = '46875304-139e-4e8d-b9ed-5a7c0ee0bf1f';
export const LEVEL_2_ID = 'caadb67c-565e-4487-b964-97a5a19491dd';

export const LOWEST_THRESHOLD = 15;
export const LOW_THRESHOLD = 30;
export const HIGH_THRESHOLD = 80;
export const HIGHEST_THRESHOLD = 100;
