import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';

interface NetworkLink {
  curve: THREE.QuadraticBezierCurve3;
  baseTube: THREE.Mesh;
  packets: THREE.Mesh[];
  speed: number;
  phases: number[];
}

@Component({
  selector: 'app-globe-animation',
  standalone: true,
  host: {
    class: 'block h-full w-full',
  },
  template: `
    <div class="globe-wrap relative h-full w-full">
      <div
        #stage
        class="globe-stage absolute inset-0 touch-none select-none"
        aria-label="Cyber network globe — move cursor to explore"
      ></div>
    </div>
  `,
  styles: [
    `
      .globe-wrap {
        width: 100%;
        height: 100%;
      }

      .globe-stage {
        cursor: crosshair;
      }

      .globe-stage canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
      }
    `,
  ],
})
export class GlobeAnimation implements AfterViewInit, OnDestroy {
  private readonly stageRef =
    viewChild.required<ElementRef<HTMLDivElement>>('stage');
  private readonly zone = inject(NgZone);

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private earthGroup?: THREE.Group;
  private gridWire?: THREE.LineSegments;
  private networkLinks: NetworkLink[] = [];
  private clock?: THREE.Clock;
  private raf = 0;
  private initialized = false;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private visible = true;
  private cleanups: Array<() => void> = [];

  private readonly globeRadius = 1.72;
  private readonly fitPadding = 1.14;

  private readonly pointer = { x: 0, y: 0 };
  private readonly hoverRot = { x: 0, y: 0 };
  private readonly smoothHover = { x: 0, y: 0 };
  private isHovered = false;
  private autoSpin = 0;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      const stage = this.stageRef().nativeElement;
      const wrap = stage.parentElement!;

      const measure = (): { w: number; h: number } => {
        const rect = wrap.getBoundingClientRect();
        const size = Math.round(Math.min(rect.width, rect.height) || rect.width);
        return { w: Math.max(size, 1), h: Math.max(size, 1) };
      };

      const tryInit = (w: number, h: number) => {
        if (!this.initialized && w > 0 && h > 0) {
          this.init(stage, w, h);
          this.initialized = true;
        } else if (this.initialized && this.renderer && this.camera) {
          this.resizeRenderer(w, h);
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const { w, h } = measure();
          tryInit(w, h);
        });
      });

      this.resizeObserver = new ResizeObserver(() => {
        const { w, h } = measure();
        tryInit(w, h);
      });
      this.resizeObserver.observe(wrap);
      this.cleanups.push(() => this.resizeObserver?.disconnect());

      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
        },
        { threshold: 0.1 },
      );
      this.intersectionObserver.observe(stage);
      this.cleanups.push(() => this.intersectionObserver?.disconnect());
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((fn) => fn());
    this.renderer?.dispose();
    this.stageRef().nativeElement.replaceChildren();
  }

  private resizeRenderer(width: number, height: number): void {
    if (!this.renderer || !this.camera) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.camera.aspect = 1;
    this.fitCamera(this.camera, 1);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
  }

  private fitCamera(camera: THREE.PerspectiveCamera, aspect: number): void {
    const bound = this.globeRadius * 1.06;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distV = bound / Math.sin(vFov / 2);
    const distH = bound / Math.sin(hFov / 2);
    camera.position.set(0, 0, Math.max(distV, distH) * this.fitPadding);
    camera.lookAt(0, 0, 0);
  }

  private generateGlobeNodes(count: number, r: number): THREE.Vector3[] {
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      nodes.push(
        new THREE.Vector3(Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r),
      );
    }
    return nodes;
  }

  private buildConnections(nodeCount: number, k: number): [number, number][] {
    const pairs = new Set<string>();
    const connections: [number, number][] = [];

    const add = (a: number, b: number) => {
      if (a === b) return;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (pairs.has(key)) return;
      pairs.add(key);
      connections.push([a, b]);
    };

    for (let i = 0; i < nodeCount; i++) {
      add(i, (i + 1) % nodeCount);
      add(i, (i + Math.floor(nodeCount / 3)) % nodeCount);
    }

    for (let i = 0; i < nodeCount; i += 4) {
      add(i, (i + k) % nodeCount);
    }

    return connections;
  }

  private init(stage: HTMLDivElement, width: number, height: number): void {
    const wrap = stage.parentElement!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    stage.appendChild(renderer.domElement);
    this.resizeRenderer(width, height);

    const loader = new THREE.TextureLoader();
    const earthMap = loader.load('/assets/earth-map.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const radius = this.globeRadius;

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.99, 64, 64),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x041428),
        emissive: new THREE.Color(0x002244),
        emissiveIntensity: 0.5,
        shininess: 40,
      }),
    );
    earthGroup.add(core);

    const continents = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      new THREE.MeshPhongMaterial({
        map: earthMap,
        emissiveMap: earthMap,
        color: new THREE.Color(0x44aaff),
        emissive: new THREE.Color(0x00ccff),
        emissiveIntensity: 0.55,
        specular: new THREE.Color(0x115566),
        shininess: 28,
        transparent: true,
        opacity: 0.88,
      }),
    );
    earthGroup.add(continents);

    const gridWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(radius * 1.003, 24, 18)),
      new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.22,
      }),
    );
    earthGroup.add(gridWire);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.04, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00a3ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    earthGroup.add(atmosphere);

    const nodePositions = this.generateGlobeNodes(22, radius * 1.008);
    const connections = this.buildConnections(nodePositions.length, 6);
    const dotsPerLink = 2;

    connections.forEach(([a, b], idx) => {
      const curve = this.arcBetween(nodePositions[a], nodePositions[b], radius);
      const baseTube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.003, 5, false),
        new THREE.MeshBasicMaterial({
          color: 0x00a3ff,
          transparent: true,
          opacity: 0.16,
        }),
      );
      earthGroup.add(baseTube);

      const packets: THREE.Mesh[] = [];
      const phases: number[] = [];
      for (let d = 0; d < dotsPerLink; d++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.024, 8, 8),
          new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.7 + (d % 2) * 0.2,
          }),
        );
        earthGroup.add(dot);
        packets.push(dot);
        phases.push(d / dotsPerLink);
      }

      this.networkLinks.push({
        curve,
        baseTube,
        packets,
        speed: 0.16 + (idx % 6) * 0.028,
        phases,
      });
    });

    const sun = new THREE.DirectionalLight(0x88ddff, 2);
    sun.position.set(4, 3, 5);
    scene.add(sun);

    scene.add(new THREE.AmbientLight(0x1a3355, 1.1));

    const cyanRim = new THREE.DirectionalLight(0x00e5ff, 1.2);
    cyanRim.position.set(-5, 2, 3);
    scene.add(cyanRim);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.earthGroup = earthGroup;
    this.gridWire = gridWire;
    this.clock = new THREE.Clock();

    const onPointerMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      if (r.width === 0) return;

      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      if (!inside) {
        this.isHovered = false;
        this.pointer.x = 0;
        this.pointer.y = 0;
        return;
      }

      this.isHovered = true;
      this.pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      this.pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    const onPointerLeave = () => {
      this.isHovered = false;
      this.pointer.x = 0;
      this.pointer.y = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', onPointerLeave);

    this.cleanups.push(() => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeave);
    });

    const render = () => {
      if (!this.visible) {
        this.raf = requestAnimationFrame(render);
        return;
      }

      const t = this.clock!.getElapsedTime();

      this.autoSpin += this.isHovered ? 0.0025 : 0.0055;

      if (this.isHovered) {
        this.hoverRot.y = this.pointer.x * 2.2;
        this.hoverRot.x = this.pointer.y * 1.0;
      } else {
        this.hoverRot.y *= 0.96;
        this.hoverRot.x *= 0.96;
      }

      this.smoothHover.x += (this.hoverRot.x - this.smoothHover.x) * 0.1;
      this.smoothHover.y += (this.hoverRot.y - this.smoothHover.y) * 0.1;

      earthGroup.rotation.y = this.autoSpin + this.smoothHover.y;
      earthGroup.rotation.x = this.smoothHover.x;
      earthGroup.position.y = Math.sin(t * 0.9) * 0.06;

      gridWire.rotation.y = t * 0.035;

      this.networkLinks.forEach((link) => {
        link.packets.forEach((packet, pi) => {
          const progress = (t * link.speed + link.phases[pi]) % 1;
          packet.position.copy(link.curve.getPoint(progress));
        });
      });

      this.renderer!.render(this.scene!, this.camera!);
      this.raf = requestAnimationFrame(render);
    };
    render();
  }

  private arcBetween(
    a: THREE.Vector3,
    b: THREE.Vector3,
    radius: number,
  ): THREE.QuadraticBezierCurve3 {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(radius * 1.22);
    return new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
  }
}
