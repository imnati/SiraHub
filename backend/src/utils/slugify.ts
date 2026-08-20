/**
 * Converts a string to a URL-safe slug.
 * e.g. "Senior Software Engineer" → "senior-software-engineer"
 * Handles basic ASCII and strips non-alphanumeric characters.
 */
export default function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/[^\w-]+/g, '')     // remove non-word chars except hyphens
    .replace(/--+/g, '-')        // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');    // trim leading/trailing hyphens
}
