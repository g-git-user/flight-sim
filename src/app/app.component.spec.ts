import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Alphabet Radio');
  });

  it('should deal 1 letter by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.letters().length).toBe(1);
  });

  it('should pick the requested number of letters', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setNbLetters(3);
    expect(app.letters().length).toBe(3);
  });

  it('should toggle the card on click', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onCardClick();
    expect(app.revealed()).toBe(true);
  });

  it('should move to the next card once revealed', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const first = app.letters().map((l) => l.letter).join('');
    app.onCardClick();
    expect(app.revealed()).toBe(true);
    app.onCardClick();
    expect(app.revealed()).toBe(false);
    expect(app.letters().map((l) => l.letter).join('')).not.toBe(first);
  });
});