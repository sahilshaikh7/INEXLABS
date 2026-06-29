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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitRevealDirective } from '../../shared/split-reveal.directive';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: string;
  label: string;
}

/**
 * ROI / value section. The neon dollar PNG scales up smoothly as it enters the
 * viewport (GSAP ScrollTrigger) and its glow pulses continuously (yoyo tween).
 */
@Component({
  selector: 'app-roi',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitRevealDirective],
  templateUrl: './roi.html',
})
export class Roi implements AfterViewInit, OnDestroy {
  protected readonly stats: Stat[] = [
    { value: '312%', label: 'Average security ROI in year one' },
    { value: '$4.45M', label: 'Avg. cost of a breach we help you avoid' },
    { value: '11x', label: 'Faster threat containment vs. industry' },
  ];

  private readonly dollar =
    viewChild.required<ElementRef<HTMLElement>>('dollar');
  private readonly glow = viewChild.required<ElementRef<HTMLElement>>('glow');
  private readonly zone = inject(NgZone);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const dollarEl = this.dollar().nativeElement;
        const glowEl = this.glow().nativeElement;

        // Scale up + rise as it enters the viewport.
        gsap.fromTo(
          dollarEl,
          { scale: 0.55, opacity: 0, y: 60, rotateZ: -6 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotateZ: 0,
            ease: 'power3.out',
            duration: 1.2,
            scrollTrigger: {
              trigger: dollarEl,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        // Continuous neon glow pulse.
        gsap.to(glowEl, {
          opacity: 0.95,
          scale: 1.12,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, this.dollar().nativeElement.closest('section') ?? undefined);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
