import type { Car } from "./Car";
import { getIntersection, lerp, type Point } from "./utils";

export type Border = [Point, Point];

export class Sensor {
  car: Car;
  rayCount = 3;
  rayLength = 150;
  raySpread = Math.PI / 2; // 90° cone
  rays: [Point, Point][] = [];
  readings: (Point | null)[] = [];

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
  ): Point | null {
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
    return { x: min.x, y: min.y };
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
      const end = this.readings[i] ?? endDefault;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
