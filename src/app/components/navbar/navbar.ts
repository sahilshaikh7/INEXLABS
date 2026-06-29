import { Component, HostListener, inject, signal } from '@angular/core';
import { LucideMenu, LucideShield, LucideX } from '@lucide/angular';
import { Logo } from '../../shared/logo';
import { cn } from '../../lib/utils';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Logo, LucideMenu, LucideShield, LucideX],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly cn = cn;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);
  private readonly smooth = inject(SmoothScrollService);

  protected navigate(event: Event, href: string): void {
    event.preventDefault();
    this.close();
    this.smooth.scrollTo(href, -80);
  }

  protected readonly links: NavLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Courses', href: '#services' },
    { label: 'Security', href: '#showcase' },
    { label: 'Pricing', href: '#roi' },
    { label: 'FAQ', href: '#faq' },
  ];

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
