// This script helps with loading ES modules on GitHub Pages
// where MIME types might be incorrectly set
(function() {
  // Check if running on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    // Add this to console for debugging
    console.log('Running on GitHub Pages, applying module loader polyfill');
    
    // Original script element (this will be removed later)
    const originalScript = document.querySelector('script[type="module"][src$="entry-client.tsx"]');
    
    if (originalScript) {
      // Create a new script that points to the built JavaScript file instead of the source TypeScript
      const newScript = document.createElement('script');
      newScript.type = 'module';
      
      // Adjust the path to point to the built JS file in the assets directory
      const builtJsPath = './assets/index.js';
      newScript.src = builtJsPath;
      
      // Add error handling
      newScript.onerror = function(error) {
        console.error('Failed to load the built JavaScript file:', error);
        
        // Try alternative paths as fallback
        const alternativePaths = [
          './assets/index.js',
          './assets/main.js',
          './assets/entry-client.js',
          './assets/index.mjs',
          './index.js'
        ];
        
        // Try each alternative path
        tryLoadScripts(alternativePaths, 0);
      };
      
      // Replace the original script with the new one
      originalScript.parentNode.replaceChild(newScript, originalScript);
    }
  }
  
  // Function to try loading scripts from alternative paths
  function tryLoadScripts(paths, index) {
    if (index >= paths.length) {
      console.error('All alternative script paths failed');
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'module';
    script.src = paths[index];
    
    script.onerror = function() {
      console.log('Failed to load from path:', paths[index]);
      tryLoadScripts(paths, index + 1);
    };
    
    document.body.appendChild(script);
  }
})(); 