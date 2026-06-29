import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from './core/smooth-scroll.service';
import { CursorComponent } from './components/cursor/cursor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent],
  template: `
    <app-cursor />
    <router-outlet />
  `,
})
export class App implements AfterViewInit, OnDestroy {
  private readonly smooth = inject(SmoothScrollService);

  ngAfterViewInit(): void {
    this.smooth.init();
  }

  ngOnDestroy(): void {
    this.smooth.destroy();
  }
}
