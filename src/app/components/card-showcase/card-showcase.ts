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

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  title: string;
  desc: string;
}

/**
 * Pinned, scroll-driven 3D showcase. As the user scrolls, the credit-card PNG
 * rotates on the Y axis and translates across the screen, progressively
 * revealing the feature copy behind it. Driven entirely by GSAP ScrollTrigger
 * (scrubbed) which is synced with Lenis at the root.
 */
@Component({
  selector: 'app-card-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-showcase.html',
})
export class CardShowcase implements AfterViewInit, OnDestroy {
  protected readonly features: Feature[] = [
    {
      title: 'Payment-grade encryption',
      desc: 'Tokenization and end-to-end encryption that keep cardholder data unreadable, even mid-breach.',
    },
    {
      title: 'PCI DSS by design',
      desc: 'Architectures and audits that take you to PCI DSS compliance without slowing your roadmap.',
    },
    {
      title: 'Real-time fraud defense',
      desc: 'Behavioral models flag anomalous transactions in milliseconds, before money ever moves.',
    },
  ];

  private readonly section =
    viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly zone = inject(NgZone);

  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const sectionEl = this.section().nativeElement;
        const cardEl = this.card().nativeElement;
        const reveals = gsap.utils.toArray<HTMLElement>('[data-card-reveal]');

        gsap.set(reveals, { opacity: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=2600',
            scrub: 1,
            pin: this.pin().nativeElement,
            anticipatePin: 1,
          },
        });

        // The card glides from center to the left while spinning on Y.
        tl.fromTo(
          cardEl,
          { rotationY: -25, xPercent: 0, scale: 1.05 },
          { rotationY: 25, xPercent: -42, scale: 0.92 },
          0,
        );

        // Reveal each feature in sequence as the card clears its space.
        reveals.forEach((el: HTMLElement, i: number) => {
          tl.to(
            el,
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 },
            0.25 + i * 0.22,
          );
        });
      }, this.section().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
