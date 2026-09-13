import { Component, signal } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

interface MorseItem {
  char: string;
  code: string;
}

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----'
};

@Component({
  selector: 'app-morse-code',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './morse-code.component.html',
  styleUrl: './morse-code.component.css',
})
export class MorseCodeComponent {
  readonly nbOptions = [1, 2, 3, 4, 5];
  readonly nbItems = signal(1);
  readonly items = signal<MorseItem[]>([]);
  readonly revealed = signal(false);
  readonly morseVisible = signal(false);
  readonly mode = signal<'all' | 'letters' | 'numbers'>('letters');
  readonly practiceMode = signal<'text' | 'audio'>('text');
  
  private readonly allChars: string[] = Object.keys(MORSE_CODE);
  
  private get filteredChars(): string[] {
    if (this.mode() === 'letters') return this.allChars.filter(c => isNaN(parseInt(c)));
    if (this.mode() === 'numbers') return this.allChars.filter(c => !isNaN(parseInt(c)));
    return this.allChars;
  }

  private lastPick: string | null = null;

  readonly fullMorse: MorseItem[] = this.allChars.map((c) => ({
    char: c,
    code: MORSE_CODE[c],
  }));

  constructor() {
    this.newSession();
  }

  setNbItems(nb: number): void {
    this.nbItems.set(nb);
    this.newSession();
  }

  setMode(mode: 'all' | 'letters' | 'numbers'): void {
    this.mode.set(mode);
    this.newSession();
  }

  setPracticeMode(mode: 'text' | 'audio'): void {
    this.practiceMode.set(mode);
    this.newSession();
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  newSession(): void {
    const pool = this.filteredChars;
    if (pool.length === 0) return;

    let picked: string[];
    do {
      picked = this.shuffle(pool).slice(0, Math.min(this.nbItems(), pool.length));
    } while (picked.join('') === this.lastPick && pool.length > 1);

    this.lastPick = picked.join('');
    this.items.set(
      picked.map((c) => ({ char: c, code: MORSE_CODE[c] }))
    );
    this.revealed.set(false);
  }

  onCardClick(): void {
    if (this.revealed()) {
      this.newSession();
    } else {
      this.revealed.set(true);
    }
  }

  toggleMorse(): void {
    this.morseVisible.update((v) => !v);
  }

  readonly isPlaying = signal(false);
  readonly playingItem = signal<string | null>(null);

  async playMorse(item: MorseItem): Promise<void> {
    const wasPlaying = this.isPlaying();
    if (!wasPlaying) {
      this.isPlaying.set(true);
    }
    this.playingItem.set(item.char);

    await new Promise<void>((resolve) => {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const durationUnit = 0.15; // 150ms
      let startTime = audioCtx.currentTime;

      const codeToPlay = item.code;
      
      for (const char of codeToPlay) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 600;

        const duration = char === '.' ? durationUnit : durationUnit * 3;

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        // Simple ramp to avoid clicks
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
        gainNode.gain.setValueAtTime(0.5, startTime + duration - 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        startTime += duration + durationUnit; // Gap
      }

      setTimeout(() => {
        audioCtx.close();
        resolve();
      }, (startTime - audioCtx.currentTime) * 1000);
    });

    this.playingItem.set(null);
    if (!wasPlaying) {
      this.isPlaying.set(false);
    }
  }

  async playSequence(): Promise<void> {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);
    
    for (const item of this.items()) {
      this.playingItem.set(item.char);
      await this.playMorse(item);
      // Wait a bit longer between items
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    this.playingItem.set(null);
    this.isPlaying.set(false);
  }
}
