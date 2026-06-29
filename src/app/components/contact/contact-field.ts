import { Component, input } from '@angular/core';
import {
  LucideBuilding2,
  LucideMail,
  LucideMessageSquare,
  LucidePhone,
  LucideUser,
} from '@lucide/angular';

@Component({
  selector: 'app-contact-field',
  standalone: true,
  imports: [
    LucideBuilding2,
    LucideMail,
    LucideMessageSquare,
    LucidePhone,
    LucideUser,
  ],
  styles: [':host { display: contents; }'],
  templateUrl: './contact-field.html',
})
export class ContactField {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<string>('text');
  readonly icon = input.required<string>();
  readonly required = input<boolean>(false);
  readonly textarea = input<boolean>(false);
}
