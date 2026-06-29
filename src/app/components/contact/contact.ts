import { Component, signal } from '@angular/core';
import {
  LucideClock,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucideSend,
} from '@lucide/angular';
import { Logo } from '../../shared/logo';
import { RevealDirective } from '../../shared/reveal.directive';
import { LottiePlayer } from '../../shared/lottie-player';
import { ContactField } from './contact-field';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    Logo,
    RevealDirective,
    LottiePlayer,
    ContactField,
    LucideClock,
    LucideMail,
    LucideMapPin,
    LucidePhone,
    LucideSend,
  ],
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly sent = signal(false);
  protected readonly socials = ['LinkedIn', 'X', 'GitHub', 'YouTube'];

  protected onSubmit(e: Event): void {
    e.preventDefault();
    this.sent.set(true);
    setTimeout(() => this.sent.set(false), 4000);
  }
}
