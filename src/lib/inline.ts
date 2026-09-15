// Tiny inline formatter for trusted copy in src/data/content.ts.
// Supports **bold** and [text](href). External links open in a new tab.
export function inline(s: string): string {
  return s
    .replace(/&(?!amp;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, text: string, href: string) => {
      const ext = /^https?:\/\//.test(href);
      return `<a class="link" href="${href}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
    });
}
