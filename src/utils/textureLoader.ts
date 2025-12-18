/**
 * Texture loader utility with WebP support and fallback
 * 
 * This utility attempts to load WebP textures first (smaller file size),
 * and falls back to JPG if WebP is not available or not supported.
 */

/**
 * Get texture URL with WebP support and fallback
 * @param basePath - Base path without extension (e.g., '../assets/textures/mars_texture')
 * @returns Array of URLs to try: [webpUrl, jpgUrl]
 */
export const getTextureUrls = (basePath: string): [string, string] => {
  // Try WebP first, then JPG as fallback
  const webpUrl = `${basePath}.webp`;
  const jpgUrl = `${basePath}.jpg`;
  return [webpUrl, jpgUrl];
};

/**
 * Load texture with WebP fallback
 * @param loader - THREE.TextureLoader instance
 * @param basePath - Base path without extension
 * @param onLoad - Success callback
 * @param onError - Error callback
 */
export const loadTextureWithFallback = (
  loader: THREE.TextureLoader,
  basePath: string,
  onLoad?: (texture: THREE.Texture) => void,
  onError?: (error: Error) => void
): void => {
  const [webpUrl, jpgUrl] = getTextureUrls(basePath);
  
  // Try WebP first
  loader.load(
    webpUrl,
    (texture) => {
      // WebP loaded successfully
      if (onLoad) onLoad(texture);
    },
    undefined,
    () => {
      // WebP failed, try JPG fallback
      loader.load(
        jpgUrl,
        (texture) => {
          if (onLoad) onLoad(texture);
        },
        undefined,
        (error) => {
          // Both failed
          if (onError) {
            onError(new Error(`Failed to load texture: ${basePath} (tried .webp and .jpg)`));
          }
        }
      );
    }
  );
};

/**
 * Check if WebP is supported in the browser
 */
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

