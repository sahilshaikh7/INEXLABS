import { Component } from '@angular/core';
import {
  LucideAward,
  LucideClock,
  LucideCpu,
  LucideHandshake,
  LucideShieldCheck,
  LucideZap,
} from '@lucide/angular';
import { RevealDirective } from '../../shared/reveal.directive';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [
    RevealDirective,
    LucideAward,
    LucideClock,
    LucideCpu,
    LucideHandshake,
    LucideShieldCheck,
    LucideZap,
  ],
  templateUrl: './why-choose-us.html',
})
export class WhyChooseUs {
  protected readonly features: Feature[] = [
    {
      icon: 'award',
      title: 'Certified Experts',
      desc: 'OSCP, CEH, CISSP, and CISM-certified professionals on every engagement.',
    },
    {
      icon: 'clock',
      title: '24×7 Support',
      desc: 'Round-the-clock monitoring and a response team that never sleeps.',
    },
    {
      icon: 'shieldCheck',
      title: 'Enterprise Security',
      desc: 'Battle-tested frameworks trusted by Fortune-grade organizations.',
    },
    {
      icon: 'cpu',
      title: 'Latest Technologies',
      desc: 'AI-driven detection and automation that stays ahead of attackers.',
    },
    {
      icon: 'zap',
      title: 'Fast Response',
      desc: 'Average incident containment in under 15 minutes, every time.',
    },
    {
      icon: 'handshake',
      title: 'Trusted Partner',
      desc: 'Transparent reporting and a partnership built on long-term trust.',
    },
  ];
}
