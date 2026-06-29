import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggered word-by-word reveal on scroll. Splits the host's text into
 * per-word spans and animates them in (mask + rise) as the element enters the
 * viewport, driven by GSAP ScrollTrigger (synced with Lenis at the root).
 */
@Directive({
  selector: '[appSplitReveal]',
  standalone: true,
})
export class SplitRevealDirective implements AfterViewInit, OnDestroy {
  /** Per-word stagger in seconds. Bare attribute use falls back to the default. */
  readonly stagger = input(0.045, {
    alias: 'appSplitReveal',
    transform: (v: string | number) => {
      const n = typeof v === 'number' ? v : parseFloat(v);
      return Number.isFinite(n) ? n : 0.045;
    },
  });

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private trigger?: ScrollTrigger;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const el = this.host.nativeElement;
    const text = el.textContent ?? '';
    const words = text.trim().split(/\s+/);

    el.textContent = '';
    el.style.setProperty('display', 'inline-block');
    const spans: HTMLSpanElement[] = [];
    words.forEach((w: string, i: number) => {
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      wrap.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = w;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      spans.push(inner);
    });

    this.zone.runOutsideAngular(() => {
      gsap.set(spans, { yPercent: 110, opacity: 0 });
      const tween = gsap.to(spans, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: this.stagger(),
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      this.trigger = tween.scrollTrigger;
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}
