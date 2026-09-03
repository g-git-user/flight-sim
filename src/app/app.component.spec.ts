import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AlphabetRadioComponent } from './alphabet-radio/alphabet-radio.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should list all apps in the sidebar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = Array.from(compiled.querySelectorAll('.sidebar-label')).map(
      (el) => el.textContent?.trim()
    );
    expect(labels).toContain('Radio Alphabet');
    expect(labels).toContain('Conversion');
    expect(labels).toContain('Descent profile');
  });
});

describe('AlphabetRadioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphabetRadioComponent],
    }).compileComponents();
  });

  it('should deal 1 letter by default', () => {
    const fixture = TestBed.createComponent(AlphabetRadioComponent);
    const app = fixture.componentInstance;
    expect(app.letters().length).toBe(1);
  });

  it('should pick the requested number of letters', () => {
    const fixture = TestBed.createComponent(AlphabetRadioComponent);
    const app = fixture.componentInstance;
    app.setNbLetters(3);
    expect(app.letters().length).toBe(3);
  });

  it('should toggle the card on click', () => {
    const fixture = TestBed.createComponent(AlphabetRadioComponent);
    const app = fixture.componentInstance;
    app.onCardClick();
    expect(app.revealed()).toBe(true);
  });

  it('should move to the next card once revealed', () => {
    const fixture = TestBed.createComponent(AlphabetRadioComponent);
    const app = fixture.componentInstance;
    const first = app.letters().map((l) => l.letter).join('');
    app.onCardClick();
    expect(app.revealed()).toBe(true);
    app.onCardClick();
    expect(app.revealed()).toBe(false);
    expect(app.letters().map((l) => l.letter).join('')).not.toBe(first);
  });
});
