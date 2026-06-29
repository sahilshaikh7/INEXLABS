import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `{{ prefix() }}{{ display() }}{{ suffix() }}`,
})
export class Counter implements OnInit, OnDestroy {
  readonly to = input.required<number>();
  readonly suffix = input<string>('');
  readonly prefix = input<string>('');
  readonly duration = input<number>(2000);

  private readonly value = signal(0);
  protected readonly display = computed(() => this.value().toLocaleString());

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private started = false;

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement;
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.started) {
        this.started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / this.duration(), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          this.value.set(Math.round(eased * this.to()));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
