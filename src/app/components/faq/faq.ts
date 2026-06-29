import { Component, signal } from '@angular/core';
import { LucidePlus } from '@lucide/angular';
import { RevealDirective } from '../../shared/reveal.directive';
import { cn } from '../../lib/utils';

interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RevealDirective, LucidePlus],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly cn = cn;
  protected readonly open = signal<number | null>(0);

  protected readonly faqs: FaqItem[] = [
    {
      q: 'How quickly can you respond to a security incident?',
      a: 'Our 24×7 SOC team begins triage within minutes. The average containment time across our incident response engagements is under 15 minutes, with a dedicated lead assigned to your case immediately.',
    },
    {
      q: 'Do you work with companies outside India?',
      a: 'Absolutely. While we are headquartered in Indore, India, we serve 850+ clients across 30+ countries. Our remote-first delivery model and global threat intelligence network support enterprises anywhere.',
    },
    {
      q: 'What certifications do your security experts hold?',
      a: 'Our team holds industry-leading certifications including OSCP, CEH, CISSP, CISM, and ISO 27001 Lead Auditor. Every engagement is staffed with appropriately certified specialists.',
    },
    {
      q: 'How is a penetration test different from a vulnerability assessment?',
      a: 'A vulnerability assessment identifies and catalogs weaknesses, while a penetration test actively exploits them to demonstrate real-world impact. Our VAPT service combines both for complete coverage.',
    },
    {
      q: 'Can you help us achieve compliance certifications?',
      a: 'Yes. We provide end-to-end guidance for ISO 27001, SOC 2, GDPR, and PCI DSS — from gap analysis and remediation to audit readiness and documentation.',
    },
  ];

  protected toggle(i: number): void {
    this.open.set(this.open() === i ? null : i);
  }
}
