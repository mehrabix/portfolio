import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShantiPeople from '../assets/music/Shanti_People.mp3';
import Time from '../assets/music/Time.mp3';
import DarudeSandstrom from '../assets/music/Darude-Sandstrom.mp3';

// Playlist configuration
const PLAYLIST = [
  {
    src: ShantiPeople,
    title: 'Asato (Mark Dekoda) - Shanti People'
  },
  {
    src: Time,
    title: 'Time'
  },
  {
    src: DarudeSandstrom,
    title: 'Darude - Sandstorm'
  }
];

const Visualizer = ({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // Create audio context only once
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    // Create source node only once
    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    }

    // Create analyser
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Connect nodes
    sourceRef.current.connect(analyser);
    analyser.connect(audioContextRef.current.destination);
    
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !canvas || !ctx) return;

      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (analyser) {
        analyser.disconnect();
      }
    };
  }, [audioRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 overflow-hidden rounded-lg"
    >
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="w-full h-full"
      />
    </motion.div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnContactSection, setIsOnContactSection] = useState(false);
  // Track if the collapse was automatic or manual
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = PLAYLIST[currentTrackIndex];
  const songTitle = currentTrack.title;

  // Check if user is viewing the contact section
  useEffect(() => {
    const checkContactSection = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        // If contact section is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (!isOnContactSection) {
            setIsOnContactSection(true);
            // Auto-collapse when entering contact section
            if (!isCollapsed) {
              setIsCollapsed(true);
              setIsAutoCollapsed(true); // Mark as auto-collapsed
            }
          }
        } else {
          if (isOnContactSection) {
            setIsOnContactSection(false);
            // Auto-expand when leaving contact section if it was auto-collapsed
            if (isCollapsed && isAutoCollapsed) {
              setIsCollapsed(false);
              setIsAutoCollapsed(false);
            }
          }
        }
      }
    };

    window.addEventListener('scroll', checkContactSection);
    checkContactSection(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', checkContactSection);
    };
  }, [isCollapsed, isAutoCollapsed, isOnContactSection]);
  
  // Modified toggle function to track auto vs manual collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsAutoCollapsed(false); // User manually toggled
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      
      // Add event listeners for audio loading states
      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleCanPlayThrough = () => {
        setIsLoading(false);
      };

      const handleError = () => {
        setIsLoading(false);
        console.error('Error loading audio');
      };

      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadstart', handleLoadStart);
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [volume]);

  // Load a specific track
  const loadTrack = useCallback((index: number) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(true);
      
      audioRef.current.src = PLAYLIST[index].src;
      setCurrentTrackIndex(index);
      setHasInteracted(true);
      
      // Auto-play if it was playing before
      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log('Play failed:', error);
              setIsLoading(false);
            });
        }
      }
    }
  }, [isPlaying]);

  // Go to next track
  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    loadTrack(nextIndex);
  }, [currentTrackIndex, loadTrack]);

  // Go to previous track
  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    loadTrack(prevIndex);
  }, [currentTrackIndex, loadTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!hasInteracted) {
          // Only set the source when user first interacts
          audioRef.current.src = currentTrack.src;
          setHasInteracted(true);
          setIsLoading(true);
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log('Play failed:', error);
              setIsPlaying(false);
              setIsLoading(false);
            });
        }
      }
    }
  };

  // Handle track end - auto-play next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <motion.div 
      className="fixed bottom-4 left-4 z-50 group"
      animate={{
        y: isCollapsed ? 'calc(100% - 40px)' : 0,
        x: isOnContactSection && !isCollapsed ? -10 : 0,
        opacity: isOnContactSection ? (isCollapsed ? 0.8 : 0.6) : 1
      }}
      transition={{ duration: 0.3 }}
      id="music-player" 
      style={{ position: 'fixed' }}
      whileHover={{
        y: isCollapsed ? 'calc(100% - 45px)' : 0,
        opacity: 1,
        x: 0
      }}
    >
      {/* Removed tooltip message */}
      
      <audio ref={audioRef} preload="none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-lg rounded-lg p-4 shadow-lg relative hover:shadow-[0_0_15px_rgba(80,194,255,0.5)] transition-all duration-300"
      >
        {/* Collapse/Expand button */}
        <motion.button
          className="absolute -top-3 right-2 w-7 h-7 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer border border-blue-500/30 hover:border-blue-500/70 transition-all duration-300 z-20"
          onClick={toggleCollapse}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
        
        {/* Visual indicator for Contact section */}
        {isOnContactSection && (
          <motion.span 
            className="absolute -top-2 left-2 h-2 w-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Visualizer */}
        {isPlaying && <Visualizer audioRef={audioRef} />}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 relative z-10"
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-sm">Loading music...</span>
            </motion.div>
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 relative z-10"
            >
              {/* Previous Track Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTrack}
                className="cursor-pointer w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                title="Previous track"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </motion.button>

              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="cursor-pointer w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/20 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"
                    />
                  ) : null}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.svg
                      key="pause"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white relative z-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="play"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white relative z-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Next Track Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="cursor-pointer w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                title="Next track"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0011 6v2.798l-5.445-3.63z" />
                </svg>
              </motion.button>

              {!isCollapsed && (
                <div className="flex flex-col gap-1">
                  <div className="overflow-hidden w-[140px] relative">
                    <div className="flex animate-marquee whitespace-nowrap">
                      <span className="text-white/80 text-xs">{songTitle}</span>
                      <span className="text-white/80 text-xs ml-4">{songTitle}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white/60 text-[10px]">
                    <span>{currentTrackIndex + 1}</span>
                    <span>/</span>
                    <span>{PLAYLIST.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="cursor-pointer w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                    >
                      <AnimatePresence mode="wait">
                        {isMuted ? (
                          <motion.svg
                            key="muted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        ) : (
                          <motion.svg
                            key="unmuted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="cursor-pointer w-20 h-1 bg-white/20 rounded-lg appearance-none hover:bg-white/30 transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual indicator for interactive area */}
        <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-xl border border-blue-400/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
    </motion.div>
  );
};

export default MusicPlayer; 