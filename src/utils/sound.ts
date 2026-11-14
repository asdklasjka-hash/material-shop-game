class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmTimer: number | null = null;
  private bgmStep = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSettings(bgm: boolean, sfx: boolean) {
    this.bgmEnabled = bgm;
    this.sfxEnabled = sfx;
    if (!bgm) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  public unlock() {
    const ctx = this.ensureContext();
    if (ctx && this.bgmEnabled && this.bgmTimer === null) {
      this.startBgm();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public startBgm() {
    if (!this.bgmEnabled || typeof window === 'undefined') return;
    if (this.bgmTimer !== null) return;

    // Gentle, cheerful storybook marimba melody (C major pentatonic)
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      880.0, 783.99, 659.25, 587.33,
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 0,
    ];

    this.bgmTimer = window.setInterval(() => {
      if (!this.bgmEnabled) return;
      const ctx = this.ctx;
      if (!ctx || ctx.state !== 'running') return;
      const note = melody[this.bgmStep % melody.length];
      this.bgmStep += 1;
      if (note > 0) {
        this.playTone(note, 0.34, 'triangle', 0.026);
      }
    }, 460);
  }

  public stopBgm() {
    if (this.bgmTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public playClick() {
    if (!this.sfxEnabled) return;
    this.playTone(587.33, 0.07, 'sine', 0.07);
  }

  public playDoorbell() {
    if (!this.sfxEnabled) return;
    this.playTone(659.25, 0.18, 'triangle', 0.08, 0);
    this.playTone(523.25, 0.28, 'triangle', 0.08, 0.14);
  }

  public playSuccess() {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.13, 'triangle', 0.1, 0);
    this.playTone(659.25, 0.13, 'triangle', 0.1, 0.09);
    this.playTone(783.99, 0.16, 'triangle', 0.1, 0.18);
    this.playTone(1046.5, 0.28, 'sine', 0.1, 0.27);
  }

  public playCoin() {
    if (!this.sfxEnabled) return;
    this.playTone(987.77, 0.09, 'sine', 0.08, 0);
    this.playTone(1318.51, 0.22, 'sine', 0.09, 0.07);
  }

  public playGentleHint() {
    if (!this.sfxEnabled) return;
    // Soft warm marimba prompt, never harsh buzzer
    this.playTone(440, 0.14, 'sine', 0.065, 0);
    this.playTone(392, 0.22, 'sine', 0.06, 0.12);
  }

  public playSparkle() {
    if (!this.sfxEnabled) return;
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.16, 'sine', 0.075, idx * 0.065);
    });
  }

  public playCelebration() {
    if (!this.sfxEnabled) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 880.0, 1046.5];
    fanfare.forEach((n, idx) => {
      this.playTone(n, idx === fanfare.length - 1 ? 0.42 : 0.15, 'triangle', 0.09, idx * 0.1);
    });
  }
}

export const soundEngine = new SoundManager();
