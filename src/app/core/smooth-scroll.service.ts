import { Injectable, NgZone, inject } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Root-level smooth scrolling powered by Lenis, perfectly synced with GSAP
 * ScrollTrigger. The key to avoiding "jumpy" scroll animations is:
 *   1. Drive Lenis from GSAP's ticker (single RAF loop).
 *   2. Tell ScrollTrigger to update on every Lenis scroll event.
 *   3. Disable GSAP's lag smoothing so the two stay frame-locked.
 *
 * Everything runs outside Angular's zone so the RAF loop never triggers change
 * detection — critical for performance with heavy animations.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly zone = inject(NgZone);
  private lenis?: Lenis;
  private tickerFn?: (time: number) => void;
  private registered = false;

  init(): void {
    if (this.lenis || typeof window === 'undefined') return;

    if (!this.registered) {
      gsap.registerPlugin(ScrollTrigger);
      this.registered = true;
    }

    this.zone.runOutsideAngular(() => {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      this.lenis = lenis;

      // 2. ScrollTrigger updates whenever Lenis reports a new scroll position.
      lenis.on('scroll', ScrollTrigger.update);

      // 1. Run Lenis off GSAP's ticker (one unified RAF loop).
      this.tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(this.tickerFn);

      // 3. Avoid GSAP smoothing out lag — keeps Lenis & ScrollTrigger frame-locked.
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
    });
  }

  /** Programmatic scroll (used by nav links / "back to top"). */
  scrollTo(target: string | number | HTMLElement, offset = 0): void {
    this.lenis?.scrollTo(target, { offset, duration: 1.2 });
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  /** Recompute ScrollTrigger positions after layout changes. */
  refresh(): void {
    ScrollTrigger.refresh();
  }

  destroy(): void {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = undefined;
    }
    ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill());
    this.lenis?.destroy();
    this.lenis = undefined;
  }
}
