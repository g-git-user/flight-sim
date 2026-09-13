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
  private readonly allChars: string[] = Object.keys(MORSE_CODE);
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

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  newSession(): void {
    let picked: string[];
    do {
      picked = this.shuffle(this.allChars).slice(0, this.nbItems());
    } while (picked.join('') === this.lastPick);

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
}
