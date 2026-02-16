import type { Car } from "./Car";
import { getIntersection, lerp, type Point } from "./utils";

export type Border = [Point, Point];

export interface Reading {
  x: number;
  y: number;
  offset: number;
}

export class Sensor {
  car: Car;
  rayCount = 7;
  rayLength = 200;
  raySpread = Math.PI; // 180° cone
  rays: [Point, Point][] = [];
  readings: (Reading | null)[] = [];

  constructor(car: Car) {
    this.car = car;
  }

  update(roadBorders: Border[], traffic: Car[]) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.getReading(this.rays[i], roadBorders, traffic));
    }
  }
  private getReading(
    ray: [Point, Point],
    borders: Border[],
    traffic: Car[]
  ): Reading | null {
    const touches: { x: number; y: number; offset: number }[] = [];

    for (const border of borders) {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) touches.push(touch);
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) touches.push(value);
      }
    }
    if (touches.length === 0) return null;

    const min = touches.reduce((a, b) => (a.offset < b.offset ? a : b));
    return { x: min.x, y: min.y, offset: min.offset };
  }

  private castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const angle =
        lerp(-this.raySpread / 2, this.raySpread / 2, t) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(angle) * this.rayLength,
        y: this.car.y - Math.cos(angle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      const [start, endDefault] = this.rays[i];
      const reading = this.readings[i];
      const end = reading ? { x: reading.x, y: reading.y } : endDefault;

      // Draw ray with neon glow effect
      const distance = reading ? reading.offset : 1;
      const intensity = 1 - distance;
      const alpha = 0.3 + intensity * 0.4;
      
      ctx.shadowBlur = 8;
      ctx.shadowColor = reading 
        ? `rgba(255, ${255 * (1 - reading.offset)}, 0, ${alpha})`
        : "rgba(0, 255, 255, 0.2)";
      
      ctx.strokeStyle = reading
        ? `rgba(255, ${255 * (1 - reading.offset)}, 0, ${alpha})`
        : "rgba(0, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw hit point
      if (reading) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
}
