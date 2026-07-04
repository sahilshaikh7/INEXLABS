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
      name: 'Atul Patidar',
      company: 'Founder & CEO',
      avatar: '/avatar-1.png',
      rating: 5,
      review:
        'As the Founder & CEO of Inexlabs, I am committed to building innovative cybersecurity solutions that help businesses stay secure in an ever-evolving digital landscape. Our mission is to deliver reliable, scalable, and proactive security services that organizations can trust.',
    },
    {
      name: 'Aman Bairagi ',
      company: 'Lead Security Consultant',
      avatar: '/aman.jpeg',
      rating: 5,
      review:
        'Specializes in VAPT, WAPT, and security consulting, delivering practical security assessments and actionable remediation recommendations.',
    },
    {
      name: 'Abhishek Vishwakarma',
      company: 'Project Manager',
      avatar: '/avatar-3.png',
      rating: 5,
      review:
        'Led multiple cybersecurity projects, delivering secure and scalable solutions through effective project management, risk assessment, and cross-functional team coordination.',
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
