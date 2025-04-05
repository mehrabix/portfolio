import { useEffect, useState } from 'react';
import moonMapUrl from '../assets/textures/moon/moon_map.jpg';

const TestTexture = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test loading the image
    const img = new Image();
    img.onload = () => {
      console.log('Texture loaded successfully!');
      setLoaded(true);
    };
    img.onerror = (e) => {
      console.error('Error loading texture:', e);
      setError('Failed to load texture');
    };
    img.src = moonMapUrl;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl mb-4">Texture Test</h1>
      
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : loaded ? (
        <div className="flex flex-col items-center">
          <div className="text-green-500 mb-2">Texture loaded successfully!</div>
          <img 
            src={moonMapUrl} 
            alt="Moon Texture" 
            className="max-w-md border border-gray-400"
          />
          <p className="mt-2">Imported URL: {moonMapUrl}</p>
        </div>
      ) : (
        <div>Loading texture...</div>
      )}
    </div>
  );
};

export default TestTexture; 