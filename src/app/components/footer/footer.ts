import { Component } from '@angular/core';
import { LucideMail, LucideMapPin, LucidePhone } from '@lucide/angular';
import { Logo } from '../../shared/logo';

interface FooterColumn {
  title: string;
  links: string[];
}

interface SocialLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [Logo, LucideMail, LucideMapPin, LucidePhone],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly officeAddress =
    '201 Vibrant Business Tower, Manorama Ganj, near Geeta Bhavan, Square, Indore, Madhya Pradesh 452001';

  protected readonly mapLinkUrl =
    'https://www.google.com/maps/search/?api=1&query=201+Vibrant+Business+Tower,+Manorama+Ganj,+near+Geeta+Bhavan,+Square,+Indore,+Madhya+Pradesh+452001';

  protected readonly email = 'support@inexlabs.in';
  protected readonly phone = '+91 9183201667';

  protected readonly socials: SocialLink[] = [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'YouTube', href: '#' },
  ];

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
