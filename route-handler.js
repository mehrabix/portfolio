// This script is used to handle SPA routing on GitHub Pages
if (window.location.search.startsWith('?/')) {
  const path = window.location.search.substr(2);
  const cleanedPath = path.replace(/~and~/g, '&');
  const hashIndex = cleanedPath.indexOf('#');
  
  let mainPath = cleanedPath;
  let hash = '';
  
  if (hashIndex >= 0) {
    mainPath = cleanedPath.substr(0, hashIndex);
    hash = cleanedPath.substr(hashIndex);
  }
  
  window.history.replaceState(
    null,
    null,
    window.location.pathname.split('?')[0] + (mainPath ? '/' + mainPath : '') + hash
  );
} 