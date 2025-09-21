import type { Car } from "./Car";
import { lerp } from "./utils";

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number; // total angle in radians
  rays: { x: number; y: number }[][];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2; // 90 degrees cone
    this.rays = [];
  }

  update() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      let t = 0;
      if (this.rayCount === 1) t = 0.5; // center the ray vertically
      else t = i / (this.rayCount - 1);

      const rayAngle =
        lerp(-this.raySpread / 2, this.raySpread / 2, t) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const [start, end] of this.rays) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(start.x, start.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(end.x, end.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
