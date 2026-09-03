import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from './theme.service';

interface AppItem {
  path: string;
  label: string;
  icon?: string;
  svg?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    '[class.dark]': 'theme.isDark()',
  },
})
export class AppComponent implements OnInit {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly apps: AppItem[] = [
    { path: 'alphabet-radio', label: 'Radio Alphabet', icon: '✈' },
    { path: 'conversion', label: 'Conversion', icon: '⇄' },
    { path: 'top-of-descent', label: 'Descent profile', icon: '↓' },
    {
      path: 'reminders',
      label: 'Reminders',
      svg: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
    },
    { path: 'density-altitude', label: 'Density Altitude', icon: '◉' },
    { path: 'app3', label: 'App 3', icon: '3' },
  ];

  readonly currentPage = signal(0);

  readonly appPages = computed(() => {
    const pages: AppItem[][] = [];
    const pageSize = 3;
    for (let i = 0; i < this.apps.length; i += pageSize) {
      pages.push(this.apps.slice(i, i + pageSize));
    }
    return pages;
  });

  private touchStartX = 0;
  private touchStartY = 0;

  ngOnInit(): void {
    this.updatePageForUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.updatePageForUrl(event.urlAfterRedirects || event.url);
      });
  }

  private updatePageForUrl(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0].replace(/^\//, '');
    const pages = this.appPages();
    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
      if (pages[pageIdx].some((app) => app.path === cleanUrl)) {
        this.currentPage.set(pageIdx);
        break;
      }
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.appPages().length - 1) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length === 1) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      // Ensure horizontal swipe is dominant and above threshold (30px)
      if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          this.nextPage();
        } else {
          this.prevPage();
        }
      }
    }
  }
}
