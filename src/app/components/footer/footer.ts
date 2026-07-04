import { Component, inject } from '@angular/core';
import { LucideMail, LucideMapPin, LucidePhone } from '@lucide/angular';
import { Brand } from '../../shared/brand';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [Brand, LucideMail, LucideMapPin, LucidePhone],
  templateUrl: './footer.html',
})
export class Footer {
  private readonly smooth = inject(SmoothScrollService);

  protected readonly year = new Date().getFullYear();

  protected readonly officeAddress =
    '201, Vibrant Business Tower, Manorama Ganj, near Geeta Bhavan, Square, Indore, Madhya Pradesh 452001';

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
      links: [
        { label: 'About', href: '#about' },
        { label: 'Why Us', href: '#why' },
        { label: 'Our Team', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Penetration Testing', href: '#services' },
        { label: 'Cloud Security', href: '#services' },
        { label: 'SOC Monitoring', href: '#services' },
        { label: 'Incident Response', href: '#services' },
        { label: 'Compliance & Risk', href: '#services' },
      ],
    },
  ];

  protected navigate(event: Event, href: string): void {
    if (!href.startsWith('#')) return;
    event.preventDefault();
    this.smooth.scrollTo(href, -80);
  }
}
