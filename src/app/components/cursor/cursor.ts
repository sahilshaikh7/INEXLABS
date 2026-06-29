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
import { gsap } from 'gsap';

/**
 * Premium custom cursor: a precise dot + a trailing ring that lerps toward the
 * pointer. Any element tagged with [data-cursor="hover"] grows the ring, and any
 * element tagged with [data-magnetic] gets a magnetic pull toward the cursor.
 * Disabled automatically on touch / coarse-pointer devices.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: contents; }'],
  template: `
    <div #dot class="cursor-dot"></div>
    <div #ring class="cursor-ring"></div>
  `,
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  private readonly dotRef = viewChild.required<ElementRef<HTMLDivElement>>('dot');
  private readonly ringRef =
    viewChild.required<ElementRef<HTMLDivElement>>('ring');
  private readonly zone = inject(NgZone);

  private raf = 0;
  private cleanups: Array<() => void> = [];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    document.documentElement.classList.add('has-custom-cursor');
    const dot = this.dotRef().nativeElement;
    const ring = this.ringRef().nativeElement;

    this.zone.runOutsideAngular(() => {
      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const ringPos = { ...mouse };

      const setDotX = gsap.quickSetter(dot, 'x', 'px');
      const setDotY = gsap.quickSetter(dot, 'y', 'px');
      const setRingX = gsap.quickSetter(ring, 'x', 'px');
      const setRingY = gsap.quickSetter(ring, 'y', 'px');

      const onMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        setDotX(mouse.x);
        setDotY(mouse.y);
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      this.cleanups.push(() => window.removeEventListener('mousemove', onMove));

      const loop = () => {
        ringPos.x += (mouse.x - ringPos.x) * 0.18;
        ringPos.y += (mouse.y - ringPos.y) * 0.18;
        setRingX(ringPos.x);
        setRingY(ringPos.y);
        this.raf = requestAnimationFrame(loop);
      };
      loop();

      // Delegated hover state for interactive elements.
      const hoverSelector =
        'a, button, [data-cursor="hover"], input, textarea, [role="button"]';
      const onOver = (e: Event) => {
        const t = e.target as HTMLElement;
        if (t.closest(hoverSelector)) ring.classList.add('is-hovering');
      };
      const onOut = (e: Event) => {
        const t = e.target as HTMLElement;
        if (t.closest(hoverSelector)) ring.classList.remove('is-hovering');
      };
      document.addEventListener('mouseover', onOver, { passive: true });
      document.addEventListener('mouseout', onOut, { passive: true });
      this.cleanups.push(() =>
        document.removeEventListener('mouseover', onOver),
      );
      this.cleanups.push(() => document.removeEventListener('mouseout', onOut));

      // Magnetic effect for [data-magnetic] elements.
      const magnets =
        document.querySelectorAll<HTMLElement>('[data-magnetic]');
      magnets.forEach((el) => this.attachMagnet(el));
      // Re-scan magnets shortly after load (covers lazily rendered content).
      const t = window.setTimeout(() => {
        document
          .querySelectorAll<HTMLElement>('[data-magnetic]:not([data-magnet-on])')
          .forEach((el) => this.attachMagnet(el));
      }, 1200);
      this.cleanups.push(() => clearTimeout(t));
    });
  }

  private attachMagnet(el: HTMLElement): void {
    el.setAttribute('data-magnet-on', '');
    const strength = Number(el.getAttribute('data-magnetic')) || 0.4;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.6,
        ease: 'power3.out',
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    this.cleanups.push(() => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
    document.documentElement.classList.remove('has-custom-cursor');
  }
}
