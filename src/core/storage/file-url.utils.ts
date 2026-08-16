export function getStoragePathFromUrl(url: string): string {
  return new URL(url).pathname.replace(/^\/uploads\//, "");
}
