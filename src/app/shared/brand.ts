import { Component, computed, input } from '@angular/core';
import { cn } from '../lib/utils';
import { Logo } from './logo';

/**
 * Logo + INEXLABS wordmark — navbar, footer, contact.
 */
@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [Logo],
  template: `
    <span [class]="classes()" [attr.aria-label]="showText() ? 'INEXLABS' : null">
      <app-logo [class]="logoClass()" />
      @if (showText()) {
        <span [class]="textClass()">
          <span>INEX</span><span class="text-[var(--cyber-blue-bright)]">LABS</span>
        </span>
      }
    </span>
  `,
})
export class Brand {
  readonly className = input<string>('', { alias: 'class' });
  readonly logoClass = input('h-10 w-10 shrink-0', { alias: 'logoClass' });
  readonly textClass = input('text-base font-semibold tracking-tight', {
    alias: 'textClass',
  });
  readonly showText = input(true, { alias: 'showText' });

  protected readonly classes = computed(() =>
    cn('inline-flex items-center gap-2.5', this.className()),
  );
}
