import { useEffect, useState } from 'react';
const COLORS = { dark: '#05060f', light: '#eef0fb' } as const;
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'); }, []);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; setTheme(next);
    try { localStorage.setItem('rhmt-theme', next); } catch { /* penyimpanan dinonaktifkan */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[next]);
  }
  return { theme, toggle };
}
