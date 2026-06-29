import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideQuote,
  LucideStar,
} from '@lucide/angular';
import { RevealDirective } from '../../shared/reveal.directive';
import { cn } from '../../lib/utils';

interface Testimonial {
  name: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    RevealDirective,
    LucideChevronLeft,
    LucideChevronRight,
    LucideQuote,
    LucideStar,
  ],
  templateUrl: './testimonials.html',
})
export class Testimonials implements OnInit, OnDestroy {
  protected readonly cn = cn;
  protected readonly active = signal(0);

  protected readonly testimonials: Testimonial[] = [
    {
      name: 'Rajiv Menon',
      company: 'CTO, FinEdge Capital',
      avatar: '/avatar-1.png',
      rating: 5,
      review:
        'INEXLABS transformed our security posture. Their SOC team caught a sophisticated intrusion attempt within minutes — something our previous vendor missed entirely. Truly an enterprise-grade partner.',
    },
    {
      name: 'Sarah Whitfield',
      company: 'CISO, Northwind Health',
      avatar: '/avatar-2.png',
      rating: 5,
      review:
        'The penetration testing report was the most thorough we have ever received. Clear, prioritized, and actionable. We achieved SOC 2 compliance months ahead of schedule thanks to their guidance.',
    },
    {
      name: 'Daniel Cho',
      company: 'VP Engineering, Lumen Cloud',
      avatar: '/avatar-3.png',
      rating: 5,
      review:
        'Their cloud security team hardened our entire AWS estate with zero disruption. Response times are unreal — incidents are contained before we even notice. Worth every rupee and then some.',
    },
  ];

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.active.update((a) => (a + 1) % this.testimonials.length);
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected go(dir: number): void {
    this.active.update(
      (a) => (a + dir + this.testimonials.length) % this.testimonials.length,
    );
  }

  protected setActive(i: number): void {
    this.active.set(i);
  }

  protected stars(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
