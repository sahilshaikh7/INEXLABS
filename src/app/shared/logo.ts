import { Component, computed, input } from '@angular/core';
import { cn } from '../lib/utils';

let logoInstance = 0;

/**
 * INEXLABS iL mark — i and L matched height (80u), same stem width (16u).
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
      .il-logo {
        filter: drop-shadow(0 0 3px rgba(0, 220, 255, 0.9))
          drop-shadow(0 0 10px rgba(0, 180, 255, 0.45));
      }
      .circuit-line {
        stroke-dasharray: 3 5;
        animation: circuit-flow 2.8s linear infinite;
      }
      @keyframes circuit-flow {
        to {
          stroke-dashoffset: -24;
        }
      }
    `,
  ],
  template: `
    <span [class]="classes()" aria-label="INEXLABS">
      <svg
        viewBox="0 0 96 96"
        fill="none"
        class="il-logo h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient [attr.id]="gid + '-dark'" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3a424d" />
            <stop offset="55%" stop-color="#252b33" />
            <stop offset="100%" stop-color="#14181e" />
          </linearGradient>
          <linearGradient [attr.id]="gid + '-dark-l'" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#343c48" />
            <stop offset="100%" stop-color="#1a1f27" />
          </linearGradient>
          <clipPath [attr.id]="gid + '-istem'">
            <rect x="8" y="28" width="16" height="57" rx="1.2" />
          </clipPath>
        </defs>

        <!-- i : dot (16×16) -->
        <rect
          x="8"
          y="8"
          width="16"
          height="16"
          rx="1.2"
          [attr.fill]="'url(#' + gid + '-dark)'"
          stroke="#2ee8ff"
          stroke-width="1.6"
        />

        <!-- i : stem (16 wide, matches L stem) -->
        <rect
          x="8"
          y="28"
          width="16"
          height="57"
          rx="1.2"
          [attr.fill]="'url(#' + gid + '-dark)'"
          stroke="#2ee8ff"
          stroke-width="1.6"
        />
        <g
          [attr.clip-path]="'url(#' + gid + '-istem)'"
          stroke="#2ee8ff"
          stroke-width="1.05"
          stroke-linecap="round"
          opacity="0.92"
        >
          <path class="circuit-line" d="M16 34 V 80" />
          <path d="M16 41 L 20 45 M16 41 L 12 45" />
          <path d="M16 52 L 20 56 M16 52 L 12 56" />
          <path d="M16 63 L 20 67 M16 63 L 12 67" />
          <circle cx="16" cy="41" r="1.5" fill="#2ee8ff" stroke="none" />
          <circle cx="20" cy="45" r="1.2" fill="#2ee8ff" stroke="none" />
          <circle cx="12" cy="45" r="1.2" fill="#2ee8ff" stroke="none" />
          <circle cx="16" cy="52" r="1.5" fill="#2ee8ff" stroke="none" />
          <circle cx="16" cy="63" r="1.5" fill="#2ee8ff" stroke="none" />
          <circle cx="16" cy="80" r="1.5" fill="#2ee8ff" stroke="none" />
        </g>

        <!-- L : same height (8→85) & stem width (16) as i -->
        <path
          d="M 32 15 L 40 8 L 48 15 L 48 69 L 72 69 L 80 77 L 72 85 L 32 85 Z"
          [attr.fill]="'url(#' + gid + '-dark-l)'"
          stroke="#2ee8ff"
          stroke-width="1.6"
          stroke-linejoin="miter"
        />
        <path
          d="M 36 19 L 40 14 L 44 19 L 44 65 L 66 65 L 72 71 L 66 77 L 36 77 Z"
          fill="none"
          stroke="#5ff4ff"
          stroke-width="0.55"
          opacity="0.35"
        />
      </svg>
    </span>
  `,
})
export class Logo {
  readonly className = input<string>('', { alias: 'class' });
  protected readonly gid = `il-${++logoInstance}`;

  protected readonly classes = computed(() =>
    cn('relative inline-flex items-center justify-center', this.className()),
  );
}
