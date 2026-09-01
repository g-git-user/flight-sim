import { Component, signal } from '@angular/core';

interface LetterItem {
  letter: string;
  word: string;
}

const NATO_PHONETIC: Record<string, string> = {
  'A': 'Alpha',
  'B': 'Bravo',
  'C': 'Charlie',
  'D': 'Delta',
  'E': 'Echo',
  'F': 'Foxtrot',
  'G': 'Golf',
  'H': 'Hotel',
  'I': 'India',
  'J': 'Juliett',
  'K': 'Kilo',
  'L': 'Lima',
  'M': 'Mike',
  'N': 'November',
  'O': 'Oscar',
  'P': 'Papa',
  'Q': 'Quebec',
  'R': 'Romeo',
  'S': 'Sierra',
  'T': 'Tango',
  'U': 'Uniform',
  'V': 'Victor',
  'W': 'Whiskey',
  'X': 'Xray',
  'Y': 'Yankee',
  'Z': 'Zulu',
};

interface RevealSegment {
  char: string;
  first: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    '[class.dark]': 'darkMode()',
  },
})
export class AppComponent {
  readonly nbOptions = [1, 2, 3, 4, 5];
  nbLetters = signal(5);
  letters = signal<LetterItem[]>([]);
  revealed = signal(false);
  darkMode = signal(true);
  private alphabet: string[] = Object.keys(NATO_PHONETIC);

  constructor() {
    this.newSession();
  }

  setNbLetters(nb: number): void {
    this.nbLetters.set(nb);
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
    const picked = this.shuffle(this.alphabet).slice(0, this.nbLetters());
    this.letters.set(
      picked.map((l) => ({ letter: l, word: NATO_PHONETIC[l] }))
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

  toggleDark(): void {
    this.darkMode.update((v) => !v);
  }

  segmentsFor(word: string): RevealSegment[] {
    return word.split('').map((char, i) => ({ char, first: i === 0 }));
  }
}