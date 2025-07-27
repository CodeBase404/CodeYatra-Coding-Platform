export const isSoundEnabled = () => {
  return localStorage.getItem("sound-enabled") !== "false"; // default: true
};

export const toggleSound = () => {
  const current = isSoundEnabled();
  localStorage.setItem("sound-enabled", String(!current));
  return !current;
};

export const playClapSound = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio("/sounds/clap.mp3");
  audio.volume = 0.8;
  audio.play().catch((err) => console.warn("Audio error:", err));
};
