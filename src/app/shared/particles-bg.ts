import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import {
  tsParticles,
  type Container,
  type ISourceOptions,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

let slimLoaded = false;
let counter = 0;

/**
 * TSParticles "cyber-network nodes" background — subtle linked particles in
 * brand cyber-blue, with a gentle attract-on-hover interaction. Runs outside
 * the Angular zone and is fully torn down on destroy.
 */
@Component({
  selector: 'app-particles-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: contents; }'],
  template: `
    <div
      #host
      [id]="id"
      aria-hidden="true"
      class="absolute inset-0 h-full w-full"
    ></div>
  `,
})
export class ParticlesBg implements AfterViewInit, OnDestroy {
  private readonly hostRef =
    viewChild.required<ElementRef<HTMLDivElement>>('host');
  private readonly zone = inject(NgZone);

  protected readonly id = `tsparticles-${counter++}`;
  private container?: Container;
  private destroyed = false;

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    await this.zone.runOutsideAngular(async () => {
      if (!slimLoaded) {
        await loadSlim(tsParticles);
        slimLoaded = true;
      }
      if (this.destroyed) return;

      const options: ISourceOptions = {
        fullScreen: { enable: false },
        fpsLimit: 60,
        detectRetina: true,
        background: { color: 'transparent' },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
            resize: { enable: true },
          },
          modes: {
            grab: {
              distance: 160,
              links: { opacity: 0.5, color: '#00a3ff' },
            },
          },
        },
        particles: {
          number: {
            value: 70,
            density: { enable: true, width: 1200, height: 800 },
          },
          color: { value: ['#00a3ff', '#0055ff', '#7b2fbe'] },
          links: {
            enable: true,
            distance: 140,
            color: '#1e63ff',
            opacity: 0.28,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            outModes: { default: 'bounce' },
          },
          opacity: {
            value: { min: 0.25, max: 0.7 },
            animation: { enable: true, speed: 0.6, sync: false },
          },
          size: { value: { min: 1, max: 2.4 } },
          shape: { type: 'circle' },
        },
      };

      this.container = await tsParticles.load({ id: this.id, options });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.container?.destroy();
    this.container = undefined;
  }
}
