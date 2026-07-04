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
  LucideAppWindow,
  LucideBug,
  LucideCloud,
  LucideCrosshair,
  LucideFileCheck2,
  LucideNetwork,
  LucideRadar,
  LucideSiren,
  LucideSmartphone,
} from '@lucide/angular';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  icon: string;
  title: string;
  desc: string;
}

interface StackPose {
  y: number;
  x: number;
  rotation: number;
  scale: number;
}

/**
 * Pinned card-deck animation — each card is "thrown" onto the stack on scroll.
 */
@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAppWindow,
    LucideBug,
    LucideCloud,
    LucideCrosshair,
    LucideFileCheck2,
    LucideNetwork,
    LucideRadar,
    LucideSiren,
    LucideSmartphone,
  ],
  templateUrl: './services.html',
})
export class Services implements AfterViewInit, OnDestroy {
  protected readonly services: Service[] = [
    {
      icon: 'appWindow',
      title: 'Web Application Security',
      desc: 'Secure your web apps against OWASP Top 10 risks with continuous testing and code review.',
    },
    {
      icon: 'smartphone',
      title: 'Mobile Application Security',
      desc: 'End-to-end assessment of iOS and Android apps, APIs, and data-at-rest protections.',
    },
    {
      icon: 'crosshair',
      title: 'VAPT',
      desc: 'Vulnerability Assessment & Penetration Testing that uncovers risks before attackers do.',
    },
    {
      icon: 'bug',
      title: 'Penetration Testing',
      desc: 'Real-world adversary simulations across networks, apps, and human attack surfaces.',
    },
    {
      icon: 'cloud',
      title: 'Cloud Security',
      desc: 'Harden AWS, Azure, and GCP environments with posture management and zero-trust controls.',
    },
    {
      icon: 'network',
      title: 'Network Security',
      desc: 'Segmentation, firewall hardening, and intrusion prevention for resilient infrastructure.',
    },
    {
      icon: 'radar',
      title: 'SOC Monitoring',
      desc: '24×7 Security Operations Center with real-time detection and threat hunting.',
    },
    {
      icon: 'siren',
      title: 'Incident Response',
      desc: 'Rapid containment, forensics, and recovery to minimize breach impact and downtime.',
    },
    {
      icon: 'fileCheck2',
      title: 'Compliance & Risk',
      desc: 'Achieve ISO 27001, SOC 2, GDPR, and PCI DSS readiness with expert guidance.',
    },
  ];

  private readonly section =
    viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  private readonly stack = viewChild.required<ElementRef<HTMLElement>>('stack');
  private readonly zone = inject(NgZone);
  private readonly smoothScroll = inject(SmoothScrollService);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.initStack());
      });
    });
  }

  /** More scroll per card = harder to rush through on fast wheel. */
  private scrollPerCard(): number {
    return Math.round(window.innerHeight * 0.58);
  }

  /** Cards behind the active one — peek out from the top like a deck. */
  private behindPose(depth: number, index: number): StackPose {
    const d = Math.min(depth, 5);
    const side = index % 2 === 0 ? -1 : 1;
    return {
      y: -d * 11,
      x: side * d * 4,
      rotation: side * d * 1.2,
      scale: Math.max(0.9, 1 - d * 0.03),
    };
  }

  private initStack(): void {
    const sectionEl = this.section().nativeElement;
    const pinEl = this.pin().nativeElement;
    const stackEl = this.stack().nativeElement;
    const cards = gsap.utils.toArray<HTMLElement>(
      '[data-service-card]',
      stackEl,
    );
    if (cards.length < 2) return;

    this.ctx = gsap.context(() => {
      const totalScroll = (cards.length - 1) * this.scrollPerCard();
      const throwSide = (i: number) => (i % 2 === 0 ? 1 : -1);

      cards.forEach((card, i) => {
        gsap.set(card, {
          transformOrigin: '50% 100%',
          transformPerspective: 1400,
          force3D: true,
        });

        if (i === 0) {
          gsap.set(card, { y: 0, x: 0, rotation: 0, scale: 1, opacity: 1 });
        } else {
          const side = throwSide(i);
          gsap.set(card, {
            yPercent: 130,
            x: side * 90,
            rotation: side * 28,
            scale: 0.86,
            opacity: 0.85,
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 2.4,
          pin: pinEl,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;

        const at = i - 1;
        const side = throwSide(i);

        for (let j = 0; j < i; j++) {
          const depth = i - j;
          const pose = this.behindPose(depth, j);
          tl.to(
            cards[j],
            {
              ...pose,
              transformOrigin: '50% 0%',
              duration: 0.55,
              ease: 'power2.out',
            },
            at,
          );
        }

        // Throw arc — card flies in then lands on the stack
        tl.to(
          card,
          {
            yPercent: 18,
            x: side * 22,
            rotation: side * 9,
            scale: 0.97,
            opacity: 1,
            duration: 0.38,
            ease: 'power2.in',
          },
          at,
        );

        tl.to(
          card,
          {
            yPercent: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            transformOrigin: '50% 100%',
            duration: 0.62,
            ease: 'power4.out',
          },
          at + 0.38,
        );
      });

      this.smoothScroll.refresh();
    }, sectionEl);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
