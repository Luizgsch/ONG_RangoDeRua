/** Âncoras da home respeitando `base` do Vite (GitHub Pages em subpasta). */
export function homeHashFragment(fragment: string): string {
  return `${import.meta.env.BASE_URL}#${fragment}`
}
