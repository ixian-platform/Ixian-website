/**
 * Hero scene: the Ixian mark as two node networks. World units = CSS px on the z = 0 plane.
 * Node counts, the newest-block marker and the block ripple come from real network data.
 */
import * as THREE from 'three';
import { EXCHANGES, QUIET, type Exchange, type Ep } from '@site/content/useCases';
import { palette } from '@site/styles/palette';

const INK = new THREE.Color(palette.text);
const INK2 = new THREE.Color(palette.text2);
const DIM = new THREE.Color(palette.text3);
const GREEN = new THREE.Color(palette.live);

const TILT = -0.98; // lean back about X (isometric feel)
const BLUE = new THREE.Color('#6f9bff'); // halo tint for S2 traffic

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

/* shared drift: points and the lines between them move together */
const DRIFT = /* glsl */ `
  vec3 drift(float ph, float amp, float t) {
    return amp * vec3(sin(t * 0.23 + ph), cos(t * 0.19 + ph * 1.7), 0.5 * sin(t * 0.13 + ph * 0.6));
  }`;
const pointVert = /* glsl */ `
  attribute float aSize; attribute float aGlow; attribute vec3 aColor; attribute float aPhase; attribute float aDrift; attribute float aKind;
  uniform float uTime; uniform float uDpr; uniform float uFade; uniform float uCamZ;
  varying vec3 vColor; varying float vAlpha; varying float vGlow; varying float vKind;
  ${DRIFT}
  void main() {
    vKind = aKind;
    vec4 mv = modelViewMatrix * vec4(position + drift(aPhase, aDrift, uTime), 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = uCamZ / -mv.z;
    vColor = aColor; vGlow = aGlow;
    float tw = 0.75 + 0.25 * sin(uTime * 0.9 + aPhase * 3.0);
    vAlpha = clamp(persp, 0.18, 1.25) * tw * uFade;
    gl_PointSize = (aSize + aGlow * 8.0) * uDpr * clamp(persp, 0.3, 1.6);
  }`;
const pointFrag = /* glsl */ `
  uniform vec3 uGreen; uniform vec3 uBlue; varying vec3 vColor; varying float vAlpha; varying float vGlow; varying float vKind;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.2, d);
    float halo = exp(-d * 6.0) * vGlow * 1.4;
    vec3 col = mix(vColor, mix(uGreen, uBlue, vKind), clamp(vGlow, 0.0, 1.0));
    float a = (core + halo) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }`;
const lineVert = /* glsl */ `
  attribute float aPhase; attribute float aDrift;
  uniform float uCamZ; uniform float uTime; varying float vA;
  ${DRIFT}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position + drift(aPhase, aDrift, uTime), 1.0);
    gl_Position = projectionMatrix * mv;
    vA = clamp(pow(uCamZ / -mv.z, 2.0), 0.18, 1.0);
  }`;
const lineFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uFade; varying float vA;
  void main() { gl_FragColor = vec4(uColor, uOpacity * vA * uFade); }`;
const noiseFrag = /* glsl */ `
  uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
  // two octaves only: soft, large shapes, no fine speckle
  float fbm(vec2 p){ return 0.667 * n(p) + 0.333 * n(p * 2.03); }
  void main() {
    float t = uTime * 0.02;
    // the section base, flat (--ix-page, #050907)
    vec3 deep = vec3(0.02, 0.035, 0.027);
    vec3 col = deep;
    // blue nebulosity, slow, strongest top-right and lower-left, never under the headline
    vec2 q = vUv * vec2(uRes.x / uRes.y, 1.0) * 1.3;
    float neb = fbm(q * 1.4 + vec2(-t * 0.6, t * 0.4) + fbm(q * 2.1 + t) * 1.2);
    float mask = smoothstep(0.25, 1.0, vUv.x) * (0.55 + 0.45 * smoothstep(0.2, 0.9, vUv.y));
    mask += 0.5 * smoothstep(0.45, 0.0, distance(vUv, vec2(0.62, 0.05)));
    col += vec3(0.07, 0.11, 0.24) * smoothstep(0.45, 0.95, neb) * mask;
    col += vec3(0.02, 0.05, 0.03) * smoothstep(0.55, 1.0, fbm(q * 0.9 - t * 0.5)) * mask;
    // the bottom edge settles on the base, so the hero hands over to How it works without a seam
    col = mix(deep, col, smoothstep(0.0, 0.2, vUv.y));
    // half a level of dither per pixel: stops banding, invisible as grain
    col += (h(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }`;

const trailVert = /* glsl */ `
  attribute float aT; varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const trailFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uHead; uniform float uTail; varying float vT;
  void main() {
    if (vT > uHead || vT < uTail) discard;
    float k = (vT - uTail) / max(uHead - uTail, 0.0001);
    gl_FragColor = vec4(uColor, pow(k, 2.0) * 0.95 + 0.05);
  }`;

const cometVert = /* glsl */ `
  attribute float aT; uniform float uHead; uniform float uTail; uniform float uDpr; varying float vK;
  void main() {
    float k = (aT - uTail) / max(uHead - uTail, 0.0001);
    vK = (aT > uHead || aT < uTail) ? -1.0 : k;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (1.2 + 5.0 * pow(max(k, 0.0), 6.0)) * uDpr;
  }`;
const cometFrag = /* glsl */ `
  uniform vec3 uColor; varying float vK;
  void main() {
    if (vK < 0.0) discard;
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * (0.15 + 0.85 * pow(vK, 3.0));
    gl_FragColor = vec4(uColor, a);
  }`;


export type Place = { cx: number; cy: number; r: number };
export type Card = { title: string; detail: string; x: number; y: number };
export type EpView = { slot: number; key: string; label: string; g: string; x: number; y: number; a: number; quiet: boolean };

type Flight = {
  line: THREE.Line; comet: THREE.Points; mat: THREE.ShaderMaterial; cmat: THREE.ShaderMaterial;
  t: number; dur: number; arrived: boolean; to: number; card: [string, string]; onArrive: () => void;
};
/* an endpoint on screen: it fades in for an exchange and out when it is over */
type Slot = { ep: Ep | null; p: THREE.Vector3; born: number; outAt: number; a: number; quiet: boolean };
/* a featured exchange: A sends, B receives (and often answers), then both fade out */
type Ex = { A: number; B: number; x: Exchange; stage: number; next: number };
type Route = { pts: THREE.Vector3[]; len: number[]; total: number; t: number; speed: number; ends: number[] };

/** A point set: positions plus per-point style. */
class PointSet {
  pos: THREE.Vector3[] = [];
  size: number[] = [];
  color: THREE.Color[] = [];
  phase: number[] = [];
  drift: number[] = [];
  kind: number[] = [];
  push(p: THREE.Vector3, size: number, color: THREE.Color, drift = 0, kind = 0) {
    this.pos.push(p);
    this.size.push(size);
    this.color.push(color);
    this.phase.push(Math.random() * 6.283);
    this.drift.push(drift);
    this.kind.push(kind);
    return this.pos.length - 1;
  }
}

const SLOTS = 40; // 0–19 featured endpoints, 20–39 quiet background ones
export const FEATURED = 20;

export class RingWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 1, 30000);
  private bgScene = new THREE.Scene();
  private bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private bgMat: THREE.ShaderMaterial;
  private logo = new THREE.Group();
  private field = new THREE.Group();
  private W = 1;
  private H = 1;
  private baseZ = 1000;
  private zoom = 1;
  private place: Place = { cx: 0, cy: 0, r: 200 };
  private counts = { dlt: 0, s2: 0 };
  private height: number | null = null;
  private U = {
    uTime: { value: 0 },
    uDpr: { value: 1 },
    uFade: { value: 0 },
    uCamZ: { value: 1000 },
    uGreen: { value: GREEN },
    uBlue: { value: BLUE },
  };
  private pointMat: THREE.ShaderMaterial;
  private built: THREE.Object3D[] = [];
  private ringGlow?: THREE.BufferAttribute;
  private dltOrder: number[] = []; // DLT node indices sorted by angle
  private s2Order: number[] = [];
  private rippleD = -1;
  private rippleS = -1;
  private lastBlue = -99;
  private exes: Ex[] = [];
  private exDeck: Exchange[] = [];
  private quietDeck: Ep[] = [];
  private centres = { dlt: new THREE.Vector3(), s2: new THREE.Vector3() };
  private hubs: THREE.Vector3[] = []; // S2 hubs, logo-local
  private hubAngles: number[] = [];
  private headGeo?: THREE.BufferGeometry;
  private flowGeo?: THREE.BufferGeometry;
  private flowPhase: number[] = [];
  private packetGeo?: THREE.BufferGeometry;
  private routes: Route[] = [];
  private fieldClients: THREE.Vector3[] = [];
  private slots: Slot[] = [];
  private epGeo?: THREE.BufferGeometry;
  private flights: Flight[] = [];
  private nextEx = 1.2;
  private v = new THREE.Vector3();
  private tilt = 0;
  private pointer = new THREE.Vector2();
  private pointerT = new THREE.Vector2();
  private running = false;
  private raf = 0;
  private t0 = performance.now();
  private last = performance.now();
  private reduced: boolean;
  /** where endpoints may appear (fractions of the hero): keeps them off the text */
  zone = { minX: 0.44, maxY: 0.86, minY: 0.1 };
  onEndpoints?: (v: EpView[]) => void;
  onCard?: (c: Card) => void;

  constructor(canvas: HTMLCanvasElement, reduced: boolean) {
    this.reduced = reduced;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.autoClear = false;
    this.pointMat = new THREE.ShaderMaterial({
      vertexShader: pointVert,
      fragmentShader: pointFrag,
      uniforms: this.U,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.bgMat = new THREE.ShaderMaterial({
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: noiseFrag,
      uniforms: { uTime: this.U.uTime, uRes: { value: new THREE.Vector2(1, 1) } },
      depthWrite: false,
      depthTest: false,
    });
    this.bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.bgMat));
    this.scene.add(this.field, this.logo);
    if (reduced) {
      this.tilt = TILT;
      this.U.uFade.value = 1;
    }
  }

  /* inputs */
  resize(w: number, h: number, place: Place) {
    this.W = w;
    this.H = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.U.uDpr.value = dpr;
    (this.bgMat.uniforms.uRes.value as THREE.Vector2).set(w, h);
    this.camera.aspect = w / h;
    this.baseZ = h / 2 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.camera.updateProjectionMatrix();
    this.place = place;
    this.applyCamera();
    this.build();
  }
  setCounts(dlt: number, s2: number) {
    if (dlt === this.counts.dlt && s2 === this.counts.s2) return;
    this.counts = { dlt, s2 };
    this.build();
  }
  setHeight(h: number | null) {
    if (h != null && this.height != null && h > this.height) this.rippleD = 0;
    this.height = h;
    this.placeHead();
  }
  setIntro(tilt01: number, _draw01: number, fade: number) {
    this.tilt = TILT * tilt01;
    this.U.uFade.value = fade;
    if (!this.running) this.renderOnce();
  }
  setZoom(k: number) {
    this.zoom = k;
    this.applyCamera();
    if (!this.running) this.renderOnce();
  }
  setPointer(nx: number, ny: number) {
    this.pointerT.set(nx, ny);
  }
  private applyCamera() {
    const k = this.zoom;
    const lx = this.place.cx - this.W / 2;
    const ly = this.H / 2 - this.place.cy;
    const cz = this.baseZ / k;
    this.camera.position.set(lx * (1 - 1 / k), ly * (1 - 1 / k), cz);
    this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0);
    this.U.uCamZ.value = cz;
  }

  /* build */
  private makePoints(ps: PointSet) {
    const n = ps.pos.length;
    const g = new THREE.BufferGeometry();
    const P = new Float32Array(n * 3);
    const C = new Float32Array(n * 3);
    ps.pos.forEach((p, i) => {
      P.set([p.x, p.y, p.z], i * 3);
      C.set([ps.color[i].r, ps.color[i].g, ps.color[i].b], i * 3);
    });
    g.setAttribute('position', new THREE.BufferAttribute(P, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(C, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(ps.size), 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(new Float32Array(ps.phase), 1));
    g.setAttribute('aDrift', new THREE.BufferAttribute(new Float32Array(ps.drift), 1));
    g.setAttribute('aKind', new THREE.BufferAttribute(new Float32Array(ps.kind), 1));
    g.setAttribute('aGlow', new THREE.BufferAttribute(new Float32Array(n), 1));
    return new THREE.Points(g, this.pointMat);
  }

  private makeLines(ps: PointSet, pairs: [number, number][], color: THREE.Color, opacity: number) {
    const P: number[] = [];
    const PH: number[] = [];
    const DR: number[] = [];
    pairs.forEach(([a, b]) => {
      for (const i of [a, b]) {
        const p = ps.pos[i];
        P.push(p.x, p.y, p.z);
        PH.push(ps.phase[i]);
        DR.push(ps.drift[i]);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(PH, 1));
    g.setAttribute('aDrift', new THREE.Float32BufferAttribute(DR, 1));
    return new THREE.LineSegments(
      g,
      new THREE.ShaderMaterial({
        vertexShader: lineVert,
        fragmentShader: lineFrag,
        uniforms: { uColor: { value: color }, uOpacity: { value: opacity }, uCamZ: this.U.uCamZ, uFade: this.U.uFade, uTime: this.U.uTime },
        transparent: true,
        depthWrite: false,
      })
    );
  }

  private build() {
    this.built.forEach((o) => {
      o.parent?.remove(o);
      (o as THREE.Mesh).geometry?.dispose();
    });
    this.built = [];
    const add = (parent: THREE.Object3D, o: THREE.Object3D) => (parent.add(o), this.built.push(o), o);
    const small = this.W < 700;
    const { r } = this.place;
    const d = r * 1.05;
    const u = new THREE.Vector3(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0);
    this.logo.position.set(this.place.cx - this.W / 2, this.H / 2 - this.place.cy, 0);
    this.centres.dlt = u.clone().multiplyScalar(-d / 2);
    this.centres.s2 = u.clone().multiplyScalar(d / 2);

    /* both rings in one plane */
    const ps = new PointSet();
    const pairs: [number, number][] = [];
    const ringNodes = { dlt: [] as number[], s2: [] as number[] };
    const RN = small ? 220 : 380;
    (['dlt', 's2'] as const).forEach((kind) => {
      const c = this.centres[kind];
      const k = kind === 's2' ? 1 : 0;
      const ids: number[] = [];
      for (let i = 0; i < RN; i++) {
        const a = rand(0, Math.PI * 2);
        const rr = r * (1 + gauss() * 0.24);
        ids.push(ps.push(new THREE.Vector3(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr, gauss() * r * 0.14), rand(1.6, 3.4), INK2.clone().lerp(INK, rand(0, 0.4)), rand(1, 3), k));
      }
      // real nodes: brighter (DLT = one per DLT node, S2 = one hub per S2 node)
      const n = kind === 'dlt' ? this.counts.dlt : this.counts.s2;
      if (kind === 's2') {
        this.hubs = [];
        this.hubAngles = [];
      }
      for (let i = 0; i < n; i++) {
        const a = (i / Math.max(1, n)) * Math.PI * 2 + (kind === 's2' ? 0.35 : 0);
        const p = new THREE.Vector3(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, 0);
        ids.push(ps.push(p, kind === 's2' ? 7.5 : 3.8, INK, 0, k));
        if (kind === 's2') {
          this.hubs.push(p);
          this.hubAngles.push(a);
        }
      }
      // mesh: each node to its 2 nearest neighbours in the same ring
      const lim = (r * 0.16) ** 2;
      ids.forEach((i) => {
        const near = ids
          .filter((j) => j !== i)
          .map((j) => ({ j, d: ps.pos[j].distanceToSquared(ps.pos[i]) }))
          .filter((o) => o.d < lim)
          .sort((x, y) => x.d - y.d)
          .slice(0, 2);
        near.forEach(({ j }) => i < j && pairs.push([i, j]));
      });
      ringNodes[kind] = ids;
    });
    const angleOrder = (ids: number[], c: THREE.Vector3) =>
      [...ids].sort((a, b) => Math.atan2(ps.pos[a].y - c.y, ps.pos[a].x - c.x) - Math.atan2(ps.pos[b].y - c.y, ps.pos[b].x - c.x));
    this.dltOrder = angleOrder(ringNodes.dlt, this.centres.dlt);
    this.s2Order = angleOrder(ringNodes.s2, this.centres.s2);
    add(this.logo, this.makeLines(ps, pairs, INK2, 0.3));
    const ringPts = add(this.logo, this.makePoints(ps)) as THREE.Points;
    this.ringGlow = ringPts.geometry.getAttribute('aGlow') as THREE.BufferAttribute;

    // newest block marker (real) on the DLT ring
    const hp = new PointSet();
    hp.push(new THREE.Vector3(), 9, INK, 0);
    this.headGeo = (add(this.logo, this.makePoints(hp)) as THREE.Points).geometry;
    this.placeHead();

    // traffic circulating round S2
    const fp = new PointSet();
    this.flowPhase = Array.from({ length: 80 }, (_, i) => (i / 80) * Math.PI * 2);
    this.flowPhase.forEach(() => fp.push(new THREE.Vector3(), 2.6, INK, 0, 1));
    this.flowGeo = (add(this.logo, this.makePoints(fp)) as THREE.Points).geometry;

    /* drifting clients across the hero */
    const F = new PointSet();
    const FN = small ? 380 : 820;
    const field: number[] = [];
    for (let i = 0; i < FN; i++) {
      const z = rand(-0.9, 0.12) * this.baseZ;
      const spread = 1 - z / this.baseZ;
      field.push(F.push(new THREE.Vector3(rand(-0.55, 0.55) * this.W * spread, rand(-0.55, 0.55) * this.H * spread, z), rand(1.4, 3.2), DIM.clone().lerp(INK, rand(0.05, 0.5)), rand(6, 22)));
    }
    const fpairs: [number, number][] = [];
    field.forEach((c, k) => {
      if (k % 2) return;
      let best = -1;
      let bd = (0.09 * this.W) ** 2;
      for (let j = k + 1; j < Math.min(field.length, k + 200); j++) {
        const dd = F.pos[field[j]].distanceToSquared(F.pos[c]);
        if (dd < bd) {
          bd = dd;
          best = field[j];
        }
      }
      if (best >= 0) fpairs.push([c, best]);
    });
    add(this.field, this.makeLines(F, fpairs, DIM, 0.2));
    add(this.field, this.makePoints(F));
    this.fieldClients = field.filter((_, k) => k % 3 === 0).map((i) => F.pos[i]);

    // ambient packets
    const pk = new PointSet();
    const PK = small ? 2 : 4;
    for (let i = 0; i < PK; i++) pk.push(new THREE.Vector3(0, 0, 99999), 3.4, INK2, 0);
    this.packetGeo = (add(this.scene, this.makePoints(pk)) as THREE.Points).geometry;

    /* endpoint slots */
    const ep = new PointSet();
    for (let i = 0; i < SLOTS; i++) ep.push(new THREE.Vector3(0, 0, 99999), 0, INK, 0);
    this.epGeo = (add(this.logo, this.makePoints(ep)) as THREE.Points).geometry;
    // a rebuild (resize, new node counts) starts the exchanges afresh
    this.slots = Array.from({ length: SLOTS }, (_, i) => ({ ep: null, p: new THREE.Vector3(), born: 0, outAt: 0, a: 0, quiet: i >= FEATURED }));
    this.exes = [];
    this.flights.forEach((f) => this.scene.remove(f.line, f.comet));
    this.flights = [];
    this.routes = Array.from({ length: PK }, () => this.idleRoute(rand(0.5, 3)));

    if (!this.running) this.renderOnce();
  }

  private placeHead() {
    if (!this.headGeo || this.height == null) return;
    const a = THREE.MathUtils.degToRad(((this.height % 120) * 3) % 360);
    const c = this.centres.dlt;
    const P = this.headGeo.getAttribute('position') as THREE.BufferAttribute;
    P.setXYZ(0, c.x + Math.cos(a) * this.place.r, c.y + Math.sin(a) * this.place.r, 1);
    P.needsUpdate = true;
  }

  /* endpoints */
  private onScreen() {
    return new Set(this.slots.filter((s) => s.ep).map((s) => s.ep!.label));
  }

  /** place one endpoint in a free slot; returns the slot index or -1 */
  private spawnSlot(t: number, quiet: boolean, ep: Ep) {
    const s = this.slots.find((o) => !o.ep && o.quiet === quiet);
    if (!s) return -1;
    const r = this.place.r;
    this.logo.updateMatrixWorld(true);
    const others = this.slots.filter((o) => o.ep).map((o) => this.toScreen(this.worldOfSlot(o)));
    const small = this.W < 700;
    const minX = small ? 26 : this.zone.minX * this.W;
    // phones: the rings fill most of the width, so endpoints sit close to them, on both sides
    // (a label near the right edge is drawn on the endpoint's left)
    const maxX = this.W - (small ? 26 : 170);
    const gap = small ? (quiet ? 90 : 110) : quiet ? 140 : 170;
    let ok = false;
    for (let tries = 0; tries < 30 && !ok; tries++) {
      // around one of the rings, on the side away from the overlap
      const ring = Math.random() < 0.5 ? 'dlt' : 's2';
      const c = this.centres[ring];
      const away = ring === 'dlt' ? Math.PI + Math.PI / 3 : Math.PI / 3;
      const a = away + gauss() * (quiet ? 1.8 : 1.4);
      // phones: the rings span the screen, so endpoints also sit inside them, in the open middle
      const rr = r * (small ? (quiet ? rand(0.5, 1.5) : rand(0.5, 1.4)) : quiet ? rand(1.2, 3.0) : rand(1.3, 2.3));
      s.p.set(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr, gauss() * r * 0.25);
      const sc = this.toScreen(this.worldOfSlot(s));
      ok =
        sc.x > minX && sc.x < maxX && sc.y > this.H * this.zone.minY && sc.y < this.H * this.zone.maxY &&
        others.every((o) => Math.hypot(o.x - sc.x, (o.y - sc.y) * 1.6) > gap);
    }
    if (!ok) return -1;
    s.ep = ep;
    s.born = t;
    s.outAt = 0;
    s.a = 0;
    return this.slots.indexOf(s);
  }

  /** a featured exchange: two endpoints fade in, talk, and fade out */
  private startExchange(t: number) {
    const shown = this.onScreen();
    const fits = (x: Exchange) => !shown.has(x.a.label) && !shown.has(x.b.label);
    if (!this.exDeck.length) this.exDeck = [...EXCHANGES].sort(() => Math.random() - 0.5);
    const k = this.exDeck.findIndex(fits);
    if (k < 0) return;
    const x = this.exDeck.splice(k, 1)[0];
    const A = this.spawnSlot(t, false, x.a);
    if (A < 0) return;
    const B = this.spawnSlot(t, false, x.b);
    if (B < 0) {
      this.slots[A].ep = null;
      return;
    }
    this.exes.push({ A, B, x, stage: 0, next: t + 0.9 });
  }

  private stepExchanges(t: number) {
    this.exes = this.exes.filter((e) => {
      if (e.stage === 0 && t >= e.next) {
        e.stage = 1;
        this.fly(e.A, e.B, e.x.send, () => {
          e.stage = e.x.reply ? 2 : 4;
          e.next = this.clock + (e.x.reply ? 1.0 : 1.6);
        });
      } else if (e.stage === 2 && t >= e.next) {
        e.stage = 3;
        this.fly(e.B, e.A, e.x.reply!, () => {
          e.stage = 4;
          e.next = this.clock + 1.6;
        });
      } else if (e.stage === 4 && t >= e.next) {
        this.slots[e.A].outAt = t;
        this.slots[e.B].outAt = t;
        return false;
      }
      return true;
    });
  }

  private worldOfSlot(s: Slot) {
    return s.p.clone().applyMatrix4(this.logo.matrixWorld);
  }

  private toScreen(p: THREE.Vector3) {
    this.v.copy(p).project(this.camera);
    return { x: ((this.v.x + 1) / 2) * this.W, y: ((1 - this.v.y) / 2) * this.H };
  }

  private hubWorld(i: number) {
    return this.hubs[i].clone().applyMatrix4(this.logo.matrixWorld);
  }
  private s2World(a: number) {
    const c = this.centres.s2;
    return new THREE.Vector3(c.x + Math.cos(a) * this.place.r, c.y + Math.sin(a) * this.place.r, 0).applyMatrix4(this.logo.matrixWorld);
  }
  private nearestHub(p: THREE.Vector3) {
    let best = 0;
    let bd = Infinity;
    this.hubs.forEach((_, i) => {
      const dd = this.hubWorld(i).distanceToSquared(p);
      if (dd < bd) {
        bd = dd;
        best = i;
      }
    });
    return best;
  }

  private clock = 0;

  /** one message from slot a to slot b: a trail, a comet, a card on arrival */
  private fly(a: number, b: number, card: [string, string], onArrive: () => void) {
    this.logo.updateMatrixWorld(true);
    const pa = this.worldOfSlot(this.slots[a]);
    const pb = this.worldOfSlot(this.slots[b]);
    // phones: endpoints sit close to the rings, so more messages go straight across, where they show
    const direct = Math.random() < (this.W < 700 ? 0.6 : 0.3) || !this.hubs.length;
    let pts: THREE.Vector3[];
    if (direct) {
      // peer to peer: a lifted arc straight between the two
      const mid = pa.clone().lerp(pb, 0.5);
      mid.z += pa.distanceTo(pb) * 0.35;
      pts = [pa, mid, pb];
    } else {
      const h0 = this.nearestHub(pa);
      const h1 = this.nearestHub(pb);
      const a0 = this.hubAngles[h0];
      let a1 = this.hubAngles[h1];
      if (a1 - a0 > Math.PI) a1 -= Math.PI * 2;
      if (a0 - a1 > Math.PI) a1 += Math.PI * 2;
      pts = [pa];
      const steps = Math.max(2, Math.round((Math.abs(a1 - a0) / Math.PI) * 10));
      for (let i = 0; i <= steps; i++) pts.push(this.s2World(a0 + ((a1 - a0) * i) / steps));
      pts.push(pb);
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    const N = 160;
    const g = new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(N - 1));
    g.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(Array.from({ length: N }, (_, i) => i / (N - 1))), 1));
    const color = direct ? INK : BLUE.clone().lerp(INK, 0.55);
    const mat = new THREE.ShaderMaterial({
      vertexShader: trailVert,
      fragmentShader: trailFrag,
      uniforms: { uColor: { value: color }, uHead: { value: 0 }, uTail: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const cmat = new THREE.ShaderMaterial({
      vertexShader: cometVert,
      fragmentShader: cometFrag,
      uniforms: { uColor: { value: color }, uHead: mat.uniforms.uHead, uTail: mat.uniforms.uTail, uDpr: this.U.uDpr },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(g, mat);
    const comet = new THREE.Points(g, cmat);
    this.scene.add(line, comet);
    this.flights.push({ line, comet, mat, cmat, t: 0, dur: THREE.MathUtils.clamp(curve.getLength() / 950, 0.7, 1.4), arrived: false, to: b, card, onArrive });
    if (!direct && this.rippleS < 0 && this.clock - this.lastBlue > 9) {
      this.rippleS = 0;
      this.lastBlue = this.clock;
    }
  }

  private stepEndpoints(t: number, dt: number) {
    this.clock = t;
    if (t > this.nextEx && this.U.uFade.value > 0.6) {
      if (this.exes.length < 3) this.startExchange(t);
      this.nextEx = t + rand(0.9, 2.0);
    }
    this.stepExchanges(t);
    const P = this.epGeo?.getAttribute('position') as THREE.BufferAttribute | undefined;
    const S = this.epGeo?.getAttribute('aSize') as THREE.BufferAttribute | undefined;
    this.logo.updateMatrixWorld(true);
    const views: EpView[] = [];
    this.slots.forEach((s, i) => {
      if (s.ep && s.outAt && t - s.outAt >= 0.9) s.ep = null;
      if (!s.ep) {
        if (P) P.setXYZ(i, 0, 0, 99999);
        return;
      }
      const fadeIn = Math.min(1, (t - s.born) / 0.7);
      const fadeOut = s.outAt ? Math.min(1, Math.max(0, 1 - (t - s.outAt) / 0.9)) : 1;
      s.a = fadeIn * fadeOut;
      if (P && S) {
        P.setXYZ(i, s.p.x, s.p.y, s.p.z);
        S.setX(i, 0); // the DOM label draws the dot
      }
      const sc = this.toScreen(this.worldOfSlot(s));
      views.push({ slot: i, key: `${s.ep.g}|${s.ep.label}`, label: s.ep.label, g: s.ep.g, x: sc.x, y: sc.y, a: s.a, quiet: s.quiet });
    });
    if (P && S) {
      P.needsUpdate = true;
      S.needsUpdate = true;
    }
    this.onEndpoints?.(views);

    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    this.flights = this.flights.filter((f) => {
      f.t += dt;
      const k = f.t / f.dur;
      f.mat.uniforms.uHead.value = ease(Math.min(1, k));
      f.mat.uniforms.uTail.value = ease(Math.min(1, Math.max(0, k - 0.35) / 0.95));
      if (!f.arrived && k >= 1) {
        f.arrived = true;
        const B = this.slots[f.to];
        if (B.ep) {
          const sc = this.toScreen(this.worldOfSlot(B));
          this.onCard?.({ title: f.card[0], detail: f.card[1], x: sc.x, y: sc.y });
        }
        f.onArrive();
      }
      if (k >= 1.3) {
        this.scene.remove(f.line, f.comet);
        f.line.geometry.dispose();
        f.mat.dispose();
        f.cmat.dispose();
        return false;
      }
      return true;
    });
  }

  private idleRoute(wait: number): Route {
    return { pts: [], len: [0], total: 1, t: -wait, speed: 1, ends: [] };
  }

  /** background traffic: two quiet endpoints fade in, one packet passes, both fade out */
  private newRoute(): Route {
    const t = this.clock;
    const shown = this.onScreen();
    if (!this.quietDeck.length) this.quietDeck = [...QUIET].sort(() => Math.random() - 0.5);
    const pick = () => {
      const k = this.quietDeck.findIndex((e) => !shown.has(e.label));
      if (k < 0) return null;
      const e = this.quietDeck.splice(k, 1)[0];
      shown.add(e.label);
      return e;
    };
    const ea = pick();
    const eb = pick();
    if (!ea || !eb) return this.idleRoute(rand(0.5, 1.5));
    const i = this.spawnSlot(t, true, ea);
    if (i < 0) return this.idleRoute(rand(0.5, 1.5));
    const j = this.spawnSlot(t, true, eb);
    if (j < 0) {
      this.slots[i].ep = null;
      return this.idleRoute(rand(0.5, 1.5));
    }
    this.logo.updateMatrixWorld(true);
    const A = this.worldOfSlot(this.slots[i]);
    const B = this.worldOfSlot(this.slots[j]);
    const pts = Math.random() < 0.4 || !this.hubs.length ? [A, B] : [A, this.hubWorld(this.nearestHub(A)), this.hubWorld(this.nearestHub(B)), B];
    const len = [0];
    for (let k = 1; k < pts.length; k++) len.push(len[k - 1] + pts[k].distanceTo(pts[k - 1]));
    // wait for the fade-in before the packet leaves
    return { pts, len, total: len[len.length - 1], t: -0.9, speed: rand(220, 360), ends: [i, j] };
  }

  private endRoute(rt: Route) {
    rt.ends.forEach((k) => {
      if (this.slots[k].ep) this.slots[k].outAt = this.clock + 0.6;
    });
  }

  /* loop */
  start() {
    if (this.running || this.reduced) return;
    this.running = true;
    this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.frame();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private pose(t: number) {
    const k = this.tilt / TILT;
    this.logo.rotation.x = this.tilt + this.pointer.y * 0.06;
    this.logo.rotation.y = (Math.sin(t * 0.11) * 0.12 + this.pointer.x * 0.08) * k;
    this.logo.rotation.z = (-0.28 + Math.sin(t * 0.07) * 0.1) * k;
    this.field.rotation.y = this.pointer.x * 0.03;
    this.field.rotation.x = -this.pointer.y * 0.02;
  }

  private ripple(order: number[], p: number, arr: Float32Array, glow = 0.8) {
    const n = order.length;
    const head = Math.floor(p * n);
    for (let k = Math.max(0, head - 5); k <= Math.min(n - 1, head); k++) if (order[k] % 2 === 0) arr[order[k]] = glow;
  }

  private frame() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const t = (now - this.t0) / 1000;
    this.U.uTime.value = t;
    this.pointer.lerp(this.pointerT, 0.04);
    this.pose(t);

    if (this.flowGeo) {
      const P = this.flowGeo.getAttribute('position') as THREE.BufferAttribute;
      const c = this.centres.s2;
      this.flowPhase.forEach((a0, i) => {
        const a = a0 + t * 0.14;
        P.setXYZ(i, c.x + Math.cos(a) * this.place.r, c.y + Math.sin(a) * this.place.r, 0.5);
      });
      P.needsUpdate = true;
    }

    if (this.packetGeo) {
      const P = this.packetGeo.getAttribute('position') as THREE.BufferAttribute;
      this.routes.forEach((rt, i) => {
        rt.t += dt;
        if (rt.pts.length < 2) {
          if (rt.t >= 0 && this.U.uFade.value > 0.6) this.routes[i] = this.newRoute();
          P.setXYZ(i, 0, 0, 99999);
          return;
        }
        if (rt.t < 0) return P.setXYZ(i, 0, 0, 99999);
        const dd = rt.t * rt.speed;
        if (dd >= rt.total) {
          this.endRoute(rt);
          this.routes[i] = this.idleRoute(rand(0.4, 1.8));
          P.setXYZ(i, 0, 0, 99999);
          return;
        }
        let k = 1;
        while (k < rt.len.length - 1 && rt.len[k] < dd) k++;
        const f = (dd - rt.len[k - 1]) / (rt.len[k] - rt.len[k - 1] || 1);
        const p = rt.pts[k - 1].clone().lerp(rt.pts[k], f);
        P.setXYZ(i, p.x, p.y, p.z);
      });
      P.needsUpdate = true;
    }

    this.stepEndpoints(t, dt);

    // halos: green round the DLT on a REAL new block; blue round S2 when example traffic passes through it
    if (this.ringGlow) {
      const arr = this.ringGlow.array as Float32Array;
      for (let i = 0; i < arr.length; i++) arr[i] *= 0.96;
      if (this.rippleD >= 0) {
        this.rippleD += dt / 3.4;
        this.ripple(this.dltOrder, this.rippleD, arr, 0.5); // softer: it sits near the text
        if (this.rippleD >= 1) this.rippleD = -1;
      }
      if (this.rippleS >= 0) {
        this.rippleS += dt / 3.4;
        this.ripple(this.s2Order, this.rippleS, arr);
        if (this.rippleS >= 1) this.rippleS = -1;
      }
      this.ringGlow.needsUpdate = true;
    }
    this.renderOnce();
  }

  renderOnce() {
    if (!this.running) this.pose((performance.now() - this.t0) / 1000);
    this.renderer.clear();
    this.renderer.render(this.bgScene, this.bgCam);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.built.forEach((o) => (o as THREE.Mesh).geometry?.dispose());
    this.renderer.dispose();
  }
}
