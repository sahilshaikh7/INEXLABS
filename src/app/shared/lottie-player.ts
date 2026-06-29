import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
  viewChild,
} from '@angular/core';
import lottie, { type AnimationItem } from 'lottie-web';

/**
 * Thin wrapper around lottie-web for animated UI icons (loading states, success
 * checkmarks, etc.). Loads outside the Angular zone; destroyed on teardown.
 */
@Component({
  selector: 'app-lottie',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: inline-block; }'],
  template: `<span #container class="block h-full w-full"></span>`,
})
export class LottiePlayer implements AfterViewInit, OnDestroy {
  /** Path to a Lottie JSON file (served from /public). */
  readonly path = input.required<string>();
  readonly loop = input(true);
  readonly autoplay = input(true);

  private readonly containerRef =
    viewChild.required<ElementRef<HTMLSpanElement>>('container');
  private readonly zone = inject(NgZone);
  private anim?: AnimationItem;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.anim = lottie.loadAnimation({
        container: this.containerRef().nativeElement,
        renderer: 'svg',
        loop: this.loop(),
        autoplay: this.autoplay(),
        path: this.path(),
      });
    });
  }

  ngOnDestroy(): void {
    this.anim?.destroy();
  }
}
