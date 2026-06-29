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

gsap.registerPlugin(ScrollTrigger);

interface Service {
  icon: string;
  title: string;
  desc: string;
}

/**
 * Services as a horizontally-scrolling, pinned gallery. The section pins while
 * the card track translates on X, mapped to vertical scroll via GSAP
 * ScrollTrigger (synced with Lenis). Falls back to a normal grid on small /
 * touch screens where horizontal pinning feels awkward.
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
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly zone = inject(NgZone);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    // Only enable horizontal pin scroll on larger pointer-capable screens.
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const trackEl = this.track().nativeElement;
        const getDistance = () =>
          Math.max(0, trackEl.scrollWidth - window.innerWidth + 64);

        gsap.to(trackEl, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: this.section().nativeElement,
            start: 'top top',
            end: () => '+=' + getDistance(),
            scrub: 1,
            pin: this.pin().nativeElement,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, this.section().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
