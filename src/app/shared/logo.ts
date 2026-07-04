import { Component, computed, input } from '@angular/core';
import { cn } from '../lib/utils';

/**
 * INEXLABS mark — inverted white I + blue L, spaced apart.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
      .trace {
        stroke-dasharray: 4 6;
        animation: dash 3s linear infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: -40;
        }
      }
    `,
  ],
  template: `
    <span [class]="classes()" aria-label="INEXLABS">
      <svg
        viewBox="0 0 56 56"
        fill="none"
        class="h-full w-full animate-border-glow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00a3ff" />
            <stop offset="100%" stop-color="#0055ff" />
          </linearGradient>
        </defs>

        <!-- Circuit accents (near I) -->
        <path
          class="trace"
          d="M6 16 H11 M8.5 16 V22 M8.5 22 H12"
          stroke="#00a3ff"
          stroke-width="1.1"
          stroke-linecap="round"
          opacity="0.7"
        />
        <circle cx="12" cy="22" r="1.3" fill="#00a3ff" opacity="0.75" />

        <!-- Inverted white I — stem on top, square dot below -->
        <rect x="10" y="10" width="7" height="22" fill="#ffffff" rx="0.75" />
        <rect x="10" y="36" width="7" height="7" fill="#ffffff" rx="1" />

        <!-- Blue L — vertical stem + bottom foot (not U / half-square) -->
        <rect x="28" y="10" width="7" height="33" fill="url(#lgrad)" rx="0.75" />
        <rect x="28" y="36" width="20" height="7" fill="url(#lgrad)" rx="1" />
      </svg>
    </span>
  `,
})
export class Logo {
  readonly className = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn('relative inline-flex items-center justify-center', this.className()),
  );
}
