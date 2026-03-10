let ctx = null;
let gain = null;
let volume = 0.3;
let muted = false;

export function initAudio() {
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    ctx = new AudioContext();
    gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
}

export function tick() {
    if (muted || !ctx) return;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.018); // Short 18ms burst
}

export function setVolume(v) {
    volume = v;
    if (gain) gain.gain.value = v;
}

export function setMuted(m) {
    muted = !!m;
}

export function chime() {
    if (muted || !ctx) return;
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.frequency.value = freq;
        osc.connect(g);
        g.connect(ctx.destination);

        // Envelope
        g.gain.setValueAtTime(0, t + i * 0.15);
        g.gain.linearRampToValueAtTime(0.5, t + i * 0.15 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.15 + 0.5);

        osc.start(t + i * 0.15);
        osc.stop(t + i * 0.15 + 0.6);
    });
}
