import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

function FullScreen({ eleRef, showIcon }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      eleRef.current?.classList.remove("custom-fullscreen");
      setIsFullScreen(false);
    } else {
      eleRef.current?.classList.add("custom-fullscreen");
      setIsFullScreen(true);
    }
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  return (
    <button
      onClick={toggleFullScreen}
      className={`absolute ${showIcon ?"top-[6.5px]":"top-2.5"} right-4 z-40 cursor-pointer bg-white dark:bg-neutral/5 dark:hover:bg-gray-800 hover:bg-white ${showIcon ? "opacity-100":"opacity-0"}  group-hover:opacity-100 text-black/40 dark:text-white p-1 rounded`}
      title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
    </button>
  );
}

export default FullScreen;
