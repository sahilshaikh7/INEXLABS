import { Component } from '@angular/core';
import { LucideEye, LucideTarget } from '@lucide/angular';
import { Counter } from '../../shared/counter';
import { RevealDirective } from '../../shared/reveal.directive';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface TimelineItem {
  year: string;
  text: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Counter, RevealDirective, LucideEye, LucideTarget],
  templateUrl: './about.html',
})
export class About {
  protected readonly stats: Stat[] = [
    { value: 12, suffix: '+', label: 'Years securing enterprises' },
    { value: 850, suffix: '+', label: 'Clients protected globally' },
    { value: 4, suffix: 'M+', label: 'Threats neutralized daily' },
    { value: 99, suffix: '.99%', label: 'Monitored uptime SLA' },
  ];

  protected readonly timeline: TimelineItem[] = [
    {
      year: '2013',
      text: 'Founded in Indore with a mission to make enterprise-grade security accessible.',
    },
    {
      year: '2017',
      text: 'Launched our 24×7 Security Operations Center and global threat intel network.',
    },
    {
      year: '2021',
      text: 'Introduced AI-driven detection, reducing client incident response time by 60%.',
    },
    {
      year: '2025',
      text: 'Trusted by 850+ organizations across 30+ countries worldwide.',
    },
  ];
}
