// Web Audio API & Web Speech API Sound Helper

// Helper to speak a word using browser Text-to-Speech
export const speakWord = (word: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.85; // Slightly slower for clear learning
  utterance.pitch = 1.0;

  // Try to find a high quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) =>
      voice.lang.startsWith('en') &&
      (voice.name.includes('Google') || voice.name.includes('Natural'))
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Web Audio API Synthesizer for SFX
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSfx = (type: 'click' | 'correct' | 'wrong' | 'levelup' | 'feed' | 'evolve' | 'bubble') => {
  if ((window as any).soundEnabled === false) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'correct': {
        // High double chime
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        const osc1 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.connect(gain);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc2.connect(gain);

        osc1.start(now);
        osc1.stop(now + 0.25);

        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
        break;
      }
      case 'wrong': {
        // Low descending buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.25);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'feed': {
        // Chewing / pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);

        // Second bite
        setTimeout(() => {
          try {
            const ctx2 = getAudioContext();
            const now2 = ctx2.currentTime;
            const osc2 = ctx2.createOscillator();
            const gain2 = ctx2.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx2.destination);
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(180, now2);
            osc2.frequency.exponentialRampToValueAtTime(450, now2 + 0.08);
            gain2.gain.setValueAtTime(0.1, now2);
            gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.08);
            osc2.start(now2);
            osc2.stop(now2 + 0.08);
          } catch {}
        }, 120);
        break;
      }
      case 'levelup': {
        // Arpeggio C4 -> E4 -> G4 -> C5
        const freqs = [261.63, 329.63, 392.0, 523.25];
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.06, now);

        freqs.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          osc.connect(gain);
          osc.start(now + index * 0.08);
          osc.stop(now + 0.4);
        });

        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        break;
      }
      case 'evolve': {
        // Sci-Fi rising sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      case 'bubble': {
        // High bubble sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
    }
  } catch (e) {
    console.error('Failed to play sound: ', e);
  }
};
