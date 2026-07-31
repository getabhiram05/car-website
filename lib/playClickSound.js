 export function playClickSound() {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      300,
      ctx.currentTime + 0.08
    );

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (err) {
    // Silently ignore if audio isn't supported
  }
}