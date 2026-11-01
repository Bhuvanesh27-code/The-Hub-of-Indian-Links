import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Subtitles,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface VideoShowcaseProps {
  videoSrc?: string;
  onExploreDirectory?: () => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videoSrc = '/assets/aistudio/The_Hub_of_Indian_Links_Ad_a4fd7ed8.mp4',
  onExploreDirectory,
}) => {
  const { t, currentLang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(77);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  // Subtitle transcript cues for full WCAG accessibility matching the official video narration
  const transcripts = [
    { start: 0, end: 9.5, text: 'Welcome to The Hub of Indian Links — the user-friendly directory that brings all official Indian government portals together in one trusted place.' },
    { start: 9.5, end: 20.5, text: 'With our simple, powerful search bar, citizens, students, and farmers can instantly find government schemes, certificates, and department services — saving valuable time.' },
    { start: 20.5, end: 31.5, text: 'Explore neatly organised categories across Central Government ministries, all 28 State Governments, and 8 Union Territories — connecting you to every corner of Bharat.' },
    { start: 31.5, end: 42.5, text: 'Enjoy seamless multilingual support across English and Indian languages, along with inspiring daily proverbs that share timeless wisdom for a better tomorrow.' },
    { start: 42.5, end: 55.5, text: 'Your online safety matters. Every link is verified against official .gov.in and .nic.in domains with HTTPS checks — while reminding you to always double-check links before visiting.' },
    { start: 55.5, end: 67.5, text: 'Created with passion by S Bhuvanesh, a grade 9 student at ES.Lords International CBSE School in Villupuram, this independent initiative bridges the digital information divide across India.' },
    { start: 67.5, end: 77.0, text: 'The Hub of Indian Links — all government links in one place. Better information, stronger India.' },
  ];

  const currentTranscript = transcripts.find(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 10);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().then(() => {
        setIsPlaying(true);
        setIsEnded(false);
      }).catch((e) => console.log('Autoplay prevented:', e));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => {
      setIsPlaying(true);
      setIsEnded(false);
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Keyboard navigation on video player container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'm') {
      e.preventDefault();
      toggleMute();
    } else if (e.key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (videoRef.current) videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
    } else if (e.key === 'c') {
      e.preventDefault();
      setShowCaptions((prev) => !prev);
    }
  };

  return (
    <section
      id="portal-video-tour"
      aria-label="Official Video Presentation and Portal Guide"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24"
    >
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0B1528] via-[#091122] to-[#060C18] border-2 border-sky-500/30 p-5 sm:p-8 shadow-2xl overflow-hidden card-hover-tilt">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-sky-300 text-xs font-semibold tracking-wider uppercase mb-2 animate-bounce-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Official Portal Walkthrough</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Watch The Hub of <span className="text-[#38BDF8]">Indian</span> <span className="text-[#34D399]">Links</span> in Action
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Experience how easy it is to find, verify, and directly access Central, State, and Union Territory government citizen services in seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Direct Portals</span>
            </span>
          </div>
        </div>

        {/* Video Cinema Container */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Video player for The Hub of Indian Links. Use Space to play/pause, M to mute, F for fullscreen, and Arrow keys to seek."
          className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/9] max-h-[520px] mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700/80 group focus-visible:ring-4 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            muted={isMuted}
            autoPlay
            loop
            aria-label="The Hub of Indian Links official video introduction"
            className="w-full h-full object-contain bg-black cursor-pointer"
            onClick={togglePlay}
          />

          {/* Subtitles Overlay (WCAG Accessible Captions) */}
          {showCaptions && currentTranscript && (
            <div
              aria-live="polite"
              aria-atomic="true"
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 rounded-xl bg-black/85 border border-white/20 text-white text-xs sm:text-sm font-semibold text-center backdrop-blur-md shadow-2xl pointer-events-none transition-all duration-200"
            >
              {currentTranscript.text}
            </div>
          )}

          {/* Muted Warning Badge on initial load */}
          {isMuted && isPlaying && (
            <button
              onClick={toggleMute}
              aria-label="Video is muted. Click or press M to unmute audio."
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 border border-white/30 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Click to Unmute Sound</span>
            </button>
          )}

          {/* Play/Pause Large Center Watermark Indicator on hover or when paused */}
          {(!isPlaying || isEnded) && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer backdrop-blur-[2px] transition-all"
            >
              <div
                aria-label={isEnded ? 'Replay Video' : 'Play Video'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1D4ED8] hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-white/40 transform hover:scale-110 active:scale-95 transition-all"
              >
                {isEnded ? (
                  <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 ml-0" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Custom Accessible Video Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Progress Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                aria-label="Video seek slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Play / Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video (Space)' : 'Play video (Space)'}
                  aria-pressed={isPlaying}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
                </button>

                {/* Restart Button */}
                <button
                  type="button"
                  onClick={handleRestart}
                  aria-label="Restart video from beginning"
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Mute / Unmute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute sound (M)' : 'Mute sound (M)'}
                  aria-pressed={!isMuted}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 flex items-center gap-1.5"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  )}
                  <span className="hidden sm:inline text-[11px] font-medium">{isMuted ? 'Muted' : 'Audio On'}</span>
                </button>

                {/* Time Display */}
                <span className="text-[11px] text-slate-300 font-mono hidden sm:inline" aria-label={`Current time ${Math.round(currentTime)} seconds of ${Math.round(duration)} seconds`}>
                  {Math.floor(currentTime)}s / {Math.floor(duration || 10)}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Captions Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCaptions(!showCaptions)}
                  aria-label={showCaptions ? 'Hide captions (C)' : 'Show captions (C)'}
                  aria-pressed={showCaptions}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    showCaptions
                      ? 'bg-[#38BDF8]/20 border border-sky-400 text-sky-300'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Subtitles className="w-4 h-4" />
                  <span className="hidden sm:inline">CC</span>
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Key Takeaways / Feature Bullets below player */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Over 660+ Central, State &amp; UT portals vetted</span>
          </div>
          <div className="flex items-center gap-2 bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Accessible in 23 Scheduled Indian Languages</span>
          </div>
          <div className="flex items-center gap-2 bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Direct links without redirects or phishing</span>
          </div>
        </div>

      </div>
    </section>
  );
};
