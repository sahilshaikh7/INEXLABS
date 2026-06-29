import { Component } from '@angular/core';
import { LucideMail, LucideMapPin, LucidePhone } from '@lucide/angular';
import { Logo } from '../../shared/logo';

interface FooterColumn {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [Logo, LucideMail, LucideMapPin, LucidePhone],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly socials = ['LinkedIn', 'X', 'GitHub', 'YouTube'];

  protected readonly columns: FooterColumn[] = [
    {
      title: 'Quick Links',
      links: ['About', 'Why Us', 'Testimonials', 'FAQ', 'Contact'],
    },
    {
      title: 'Services',
      links: [
        'Penetration Testing',
        'Cloud Security',
        'SOC Monitoring',
        'Incident Response',
        'Compliance & Risk',
      ],
    },
  ];
}
