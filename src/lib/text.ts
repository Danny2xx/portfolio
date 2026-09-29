/** Two-letter monogram for a name, used on row tiles and avatars. */
export const initials = (s: string) =>
  s.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
