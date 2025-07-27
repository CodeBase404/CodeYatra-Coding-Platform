import confetti from "canvas-confetti";

const triggerConfetti = () => {
  const end = Date.now() + 3 * 1000;
  const colors = ["#a786ff", "#fd8bbc",];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

export default triggerConfetti