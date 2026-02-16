import type { Border } from "./sensor";
import { lerp } from "./utils";

const infinity = 1000000;
export class Road {
  x: number;
  y: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: Border[];
  isHorizontal: boolean;

  constructor(
    x: number,
    width: number,
    laneCount = 3,
    isHorizontal = true,
    y: number = 0
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.laneCount = laneCount;
    this.isHorizontal = isHorizontal;

    if (isHorizontal) {
      this.left = x - infinity;
      this.right = x + infinity;
      this.top = y - width / 2;
      this.bottom = y + width / 2;
    } else {
      this.left = x - width / 2;
      this.right = x + width / 2;
      this.top = y - infinity;
      this.bottom = y + infinity;
    }

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter = (laneIndex: number) => {
    const laneWidth = this.width / this.laneCount;
    if (this.isHorizontal) {
      return {
        x: this.x,
        y:
          this.top +
          laneWidth / 2 +
          Math.min(laneIndex, this.laneCount - 1) * laneWidth,
      };
    } else {
      return {
        x:
          this.left +
          laneWidth / 2 +
          Math.min(laneIndex, this.laneCount - 1) * laneWidth,
        y: this.y,
      };
    }
  };

  draw(ctx: CanvasRenderingContext2D) {
    // Road surface with gradient for depth
    const gradient = ctx.createLinearGradient(
      this.isHorizontal ? this.left : this.x - this.width / 2,
      this.isHorizontal ? this.y - this.width / 2 : this.top,
      this.isHorizontal ? this.right : this.x + this.width / 2,
      this.isHorizontal ? this.y + this.width / 2 : this.bottom
    );
    gradient.addColorStop(0, "#2d3748");
    gradient.addColorStop(0.5, "#1a202c");
    gradient.addColorStop(1, "#2d3748");
    ctx.fillStyle = gradient;
    ctx.fillRect(this.left, this.top, this.right - this.left, this.bottom - this.top);

    // Road texture lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      if (this.isHorizontal) {
        const y = this.top + (this.bottom - this.top) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(this.left, y);
        ctx.lineTo(this.right, y);
        ctx.stroke();
      } else {
        const x = this.left + (this.right - this.left) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(x, this.top);
        ctx.lineTo(x, this.bottom);
        ctx.stroke();
      }
    }

    // Lane markings with neon glow
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#fbbf24";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    for (let i = 1; i <= this.laneCount - 1; i++) {
      if (this.isHorizontal) {
        const y = lerp(this.top, this.bottom, i / this.laneCount);
        ctx.setLineDash([40, 30]);
        ctx.beginPath();
        ctx.moveTo(this.left, y);
        ctx.lineTo(this.right, y);
        ctx.stroke();
      } else {
        const x = lerp(this.left, this.right, i / this.laneCount);
        ctx.setLineDash([40, 30]);
        ctx.beginPath();
        ctx.moveTo(x, this.top);
        ctx.lineTo(x, this.bottom);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Road borders with glow
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
  }
}
