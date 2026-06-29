import { Component, computed, input } from '@angular/core';
import { cn } from '../lib/utils';

/**
 * INEXLABS circuit "L" mark. Pure SVG so it stays razor-sharp at any size, with
 * a continuous glowing-border animation (drives the `border-glow` keyframes /
 * SVG drop-shadow filter) plus animated circuit traces.
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
        viewBox="0 0 48 48"
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

        <!-- Circuit traces feeding the L -->
        <path
          class="trace"
          d="M10 14 H16 M13 14 V22 M13 22 H18 M10 30 H15"
          stroke="#00a3ff"
          stroke-width="1.2"
          stroke-linecap="round"
          opacity="0.7"
        />
        <circle cx="18" cy="22" r="1.4" fill="#00a3ff" />
        <circle cx="15" cy="30" r="1.4" fill="#00a3ff" />

        <!-- The "L" -->
        <path
          d="M20 8 H27 V34 H40 V41 H20 Z"
          fill="url(#lgrad)"
          stroke="#7fd0ff"
          stroke-width="1"
          stroke-linejoin="round"
        />
        <!-- Top notch detail -->
        <rect x="20" y="8" width="7" height="5" fill="#0a0c10" opacity="0.5" />
      </svg>
    </span>
  `,
})
export class Logo {
  readonly className = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'relative inline-flex items-center justify-center rounded-lg p-1',
      this.className(),
    ),
  );
}
