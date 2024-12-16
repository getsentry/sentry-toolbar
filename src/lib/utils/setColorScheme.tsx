export default function setColorScheme(host: HTMLElement, theme: 'system' | 'light' | 'dark') {
  if (theme === 'light' || theme === 'dark') {
    host.dataset.theme = theme;
    return () => {};
  }
  if (!window.matchMedia) {
    host.dataset.theme = 'light';
    return () => {};
  }
  const match = window.matchMedia('(prefers-color-scheme: dark)');
  host.dataset.theme = match.matches ? 'dark' : 'light';
  const onChange = () => {
    setColorScheme(host, 'system');
  };
  match.addEventListener('change', onChange);
  return () => match.removeEventListener('change', onChange);
}
