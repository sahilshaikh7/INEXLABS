import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import {
  LucideArrowRight,
  LucideLock,
  LucidePlayCircle,
  LucideShieldCheck,
} from '@lucide/angular';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ParticlesBg } from '../../shared/particles-bg';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ParticlesBg,
    LucideArrowRight,
    LucideLock,
    LucidePlayCircle,
    LucideShieldCheck,
  ],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit, OnDestroy {
  protected readonly badges = ['SOC 2 Type II', 'ISO 27001', 'GDPR Ready', 'PCI DSS'];

  private readonly stageRef =
    viewChild.required<ElementRef<HTMLDivElement>>('stage');
  private readonly copyRef =
    viewChild.required<ElementRef<HTMLDivElement>>('copy');
  private readonly glitchRef =
    viewChild.required<ElementRef<HTMLElement>>('glitch');

  private readonly zone = inject(NgZone);

  // three.js handles
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private plane?: THREE.Mesh;
  private texture?: THREE.Texture;
  private raf = 0;

  private readonly pointer = { x: 0, y: 0 };
  private readonly target = { x: 0, y: 0 };
  private clock?: THREE.Clock;
  private cleanups: Array<() => void> = [];
  private glitchTimer = 0;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.initThree();
      this.initReveal();
      this.initGlitchLoop();
    });
  }

  // ---------------------------------------------------------------------------
  // Three.js: hacker PNG mapped onto a PlaneGeometry (transparent material),
  // with a floating animation + subtle 3D parallax tilt that follows the mouse.
  // ---------------------------------------------------------------------------
  private initThree(): void {
    const stage = this.stageRef().nativeElement;
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('/assets/hacker.png', () => {
      // Size the plane to the image's aspect ratio once loaded.
      const img = texture.image as HTMLImageElement;
      const aspect = img.width / img.height;
      const planeH = 4.6;
      plane.scale.set(planeH * aspect, planeH, 1);
      // Glitchy fade-in once the texture is ready.
      gsap.fromTo(
        material,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out' },
      );
      gsap.fromTo(
        plane.position,
        { x: 0.4 },
        { x: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
      );
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.plane = plane;
    this.texture = texture;
    this.clock = new THREE.Clock();

    // Mouse parallax (normalized -0.5..0.5 relative to stage).
    const onPointer = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      this.pointer.x = (e.clientX - r.left) / r.width - 0.5;
      this.pointer.y = (e.clientY - r.top) / r.height - 0.5;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    this.cleanups.push(() =>
      window.removeEventListener('pointermove', onPointer),
    );

    const onResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    this.cleanups.push(() => window.removeEventListener('resize', onResize));

    const render = () => {
      const t = this.clock!.getElapsedTime();
      // Smoothly ease the tilt toward the pointer.
      this.target.x += (this.pointer.x - this.target.x) * 0.06;
      this.target.y += (this.pointer.y - this.target.y) * 0.06;

      plane.rotation.y = this.target.x * 0.5;
      plane.rotation.x = this.target.y * 0.4;
      // Floating bob.
      plane.position.y = Math.sin(t * 0.9) * 0.12;

      renderer.render(scene, camera);
      this.raf = requestAnimationFrame(render);
    };
    render();
  }

  // GSAP clip-path reveal from the bottom for each line of hero copy.
  private initReveal(): void {
    const copy = this.copyRef().nativeElement;
    const items = Array.from(
      copy.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    gsap.set(items, { clipPath: 'inset(0 0 100% 0)', y: 24, opacity: 0 });
    gsap.to(items, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.2,
    });
  }

  // Occasionally fire the RGB-shift glitch on the headline accent word.
  private initGlitchLoop(): void {
    const el = this.glitchRef().nativeElement;
    const fire = () => {
      el.classList.add('is-glitching');
      window.setTimeout(() => el.classList.remove('is-glitching'), 600);
      this.glitchTimer = window.setTimeout(
        fire,
        2500 + Math.random() * 3500,
      );
    };
    this.glitchTimer = window.setTimeout(fire, 1800);
    this.cleanups.push(() => clearTimeout(this.glitchTimer));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
    this.texture?.dispose();
    this.plane?.geometry.dispose();
    (this.plane?.material as THREE.Material | undefined)?.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement,
      );
    }
  }
}
