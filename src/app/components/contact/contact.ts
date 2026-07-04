import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideClock,
  LucideExternalLink,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucideSend,
} from '@lucide/angular';
import { Brand } from '../../shared/brand';
import { RevealDirective } from '../../shared/reveal.directive';
import { LottiePlayer } from '../../shared/lottie-player';
import { ContactField } from './contact-field';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    Brand,
    RevealDirective,
    LottiePlayer,
    ContactField,
    LucideClock,
    LucideExternalLink,
    LucideMail,
    LucideMapPin,
    LucidePhone,
    LucideSend,
  ],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly sent = signal(false);
  protected readonly socials = ['LinkedIn', 'Instagram', 'Facebook', 'YouTube'];

  protected readonly officeAddress =
    '201, Vibrant Business Tower, Manorama Ganj, near Geeta Bhavan, Square, Indore, Madhya Pradesh 452001';

  protected readonly mapEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://maps.google.com/maps?q=201+Vibrant+Business+Tower,+Manorama+Ganj,+near+Geeta+Bhavan,+Square,+Indore,+Madhya+Pradesh+452001&hl=en&z=17&output=embed',
  );

  protected readonly mapLinkUrl =
    'https://www.google.com/maps/search/?api=1&query=201+Vibrant+Business+Tower,+Manorama+Ganj,+near+Geeta+Bhavan,+Square,+Indore,+Madhya+Pradesh+452001';

  protected onSubmit(e: Event): void {
    e.preventDefault();
    this.sent.set(true);
    setTimeout(() => this.sent.set(false), 4000);
  }
}
