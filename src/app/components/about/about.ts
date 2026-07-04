import { Component } from '@angular/core';
import { LucideEye, LucideShield, LucideTarget, LucideZap } from '@lucide/angular';
import { RevealDirective } from '../../shared/reveal.directive';
import { GlobeAnimation } from './globe-animation';

interface Pillar {
  icon: 'shield' | 'zap' | 'target';
  title: string;
  desc: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, GlobeAnimation, LucideEye, LucideShield, LucideTarget, LucideZap],
  templateUrl: './about.html',
})
export class About {
  protected readonly pillars: Pillar[] = [
    {
      icon: 'shield',
      title: 'Defense in depth',
      desc: 'Layered controls across endpoints, cloud, and identity — no single point of failure.',
    },
    {
      icon: 'zap',
      title: 'Real-time response',
      desc: '24×7 SOC analysts who detect, contain, and neutralize threats before they spread.',
    },
    {
      icon: 'target',
      title: 'Precision testing',
      desc: 'Certified ethical hackers who think like adversaries and harden what matters most.',
    },
  ];
}
