import { useState, useRef, useEffect } from "react";
import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  FastForward,
  Rewind,
} from "lucide-react";

const getCloudinaryUrlWithResolution = (baseUrl, width, height) => {
  return baseUrl?.replace("/upload/", `/upload/w_${width},h_${height},c_limit/`);
};

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const wrapperRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("720p");
  const resolutions = {
    "360p": { width: 640, height: 360 },
    "720p": { width: 1280, height: 720 },
    "1080p": { width: 1920, height: 1080 },
  };

  const transformedUrl = getCloudinaryUrlWithResolution(
    secureUrl,
    resolutions[quality].width,
    resolutions[quality].height
  );

  useEffect(() => {
    const width = window.innerWidth;
    if (width < 640) setQuality("360p");
    else if (width < 1280) setQuality("720p");
    else setQuality("1080p");
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.5, 2, 0.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextRate = speeds[(currentIndex + 1) % speeds.length];
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
    setPlaybackRate(nextRate);
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsEnded(false);
      } else {
        videoRef.current.play();
        setIsEnded(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsEnded(false);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapper.requestFullscreen();
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-6xl max-h-170 mx-auto overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={transformedUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full h-full object-contain backdrop-blur-3xl cursor-pointer"
      />

      {/* Video Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent pb-3 px-3 transition-opacity ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center w-full mb-2">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
                setIsEnded(false);
              }
            }}
            className="w-full h-1 rounded-lg appearance-none hover:cursor-pointer bg-transparent transition-all duration-200 ease-in-out 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 
              [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:shadow 
              [&::-webkit-slider-thumb]:cursor-pointer 
            [&::-moz-range-thumb]:bg-white 
              [&::-moz-range-thumb]:w-3 
              [&::-moz-range-thumb]:h-3 
              [&::-moz-range-thumb]:border-none 
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f97316 ${
                (currentTime / duration) * 100
              }%, #575656 ${(currentTime / duration) * 100}%)`,
            }}
          />
        </div>

        <div className="flex justify-between px-2 ">

          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button
                onClick={skipBackward}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer"
                aria-label="Rewind 10 seconds"
              >
                <Rewind className="w-4 h-4 pr-0.5 text-white" />
              </button>
              {isEnded ? (
                <button
                  onClick={restart}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  onClick={togglePlayPause}
                  className="btn btn-circle btn-primary w-9 h-9"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                </button>
              )}

              <button
                onClick={skipForward}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer"
                aria-label="Forward 10 seconds"
              >
                <FastForward className="w-4 h-4 text-white" />
              </button>
            </div>

            <div
              onMouseEnter={() => setShowSlider(true)}
              onMouseLeave={() => setShowSlider(false)}
              className="flex items-center gap-2.5 mr-1"
            >
              <button
                onClick={toggleMute}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                <Volume2
                  className={`w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200 ${
                    isMuted ? "opacity-50" : ""
                  }`}
                />
              </button>
              {showSlider && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              )}
            </div>

            <div className="flex flex-row gap-1">
              <span className="text-white text-sm">
                {formatTime(currentTime)}
              </span>
              /
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSpeed}
              className="w-9 h-9 px-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md transition-all duration-200 hover:scale-105 cursor-pointer"
              aria-label="Change Speed"
            >
              {playbackRate}x
            </button>
            <select
              className="h-9 text-black bg-white/10 backdrop-blur-sm rounded px-2 py-1 text-sm"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="360p">360p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>

            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer"
              aria-label="Fullscreen"
            >
              <Maximize className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Editorial;
