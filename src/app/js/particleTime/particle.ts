import { getRandom, getTimeText, getTextPoints } from "./utils";

export class Particle {
  private ctx: CanvasRenderingContext2D;
  private r: number;
  private cx: number; // current x
  private cy: number; // current y
  private size: number;
  private duration: number = 500;
  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    this.r = Math.min(canvas.width, canvas.height) / 2;
    const ix = canvas.width / 2,
      iy = canvas.height / 2;
    const deg = (getRandom(0, 360) * Math.PI) / 180;
    this.cx = ix + this.r * Math.cos(deg);
    this.cy = iy + this.r * Math.sin(deg);
    this.size = getRandom(2 * devicePixelRatio, 4 * devicePixelRatio);
  }

  draw() {
    this.ctx.fillStyle = "#00000070";
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   *
   * @param tx target x
   * @param ty target y
   */
  move(tx: number, ty: number) {
    const st = Date.now();
    // sx: start x, sy: start y
    const sx = this.cx,
      sy = this.cy;
    // xs: x speed, ys: y speed
    const xs = (tx - sx) / this.duration,
      ys = (ty - sy) / this.duration;
    const _move = () => {
      const t = Date.now() - st;
      this.cx = sx + xs * t;
      this.cy = sy + ys * t;
      if (Date.now() - st >= this.duration) {
        this.cx = tx;
        this.cy = ty;
        return;
      }
      requestAnimationFrame(_move);
    };
    _move();
  }
}

function clear(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let particles: Particle[] = [];
export function drawParticleTime(canvas: HTMLCanvasElement) {
  clear(canvas);
  updateTimeText(canvas);
  drawParticles(particles);
  requestAnimationFrame(() => drawParticleTime(canvas));
}

function drawParticles(particles: Particle[]) {
  particles.forEach((p) => p.draw());
}

let oldTimeText = "";
export function updateTimeText(canvas: HTMLCanvasElement) {
  const fillColor = "#000";
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const newTimeText = getTimeText();
  if (newTimeText === oldTimeText) return;
  clear(canvas);
  oldTimeText = newTimeText;
  const { width, height } = canvas;
  ctx.fillStyle = fillColor;
  ctx.textBaseline = "middle";
  ctx.font = `${140 * devicePixelRatio}px Arial`;
  const { width: tWidth } = ctx.measureText(newTimeText);
  ctx.fillText(newTimeText, (width - tWidth) / 2, height / 2);
  const points = getTextPoints(canvas, { color: fillColor, gap: 10 });
  for (let i = 0; i < points.length; i++) {
    let p = particles[i];
    if (!p) {
      p = new Particle(canvas);
      particles.push(p);
    }
    const { x, y } = points[i];
    p.move(x, y);
  }
  if (points.length < particles.length) {
    particles.splice(points.length);
  }
}
