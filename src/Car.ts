import { Controls } from "./Controls";
import { polysIntersect, type Point } from "./utils";
import { type Border } from "./sensor";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed = 0;
  acceleration = 0.2;
  maxSpeed = 3;
  friction = 0.03;
  angle = 0;
  damaged = false;
  controls: Controls;
  polygon: Point[];
  controlType: string;
  useBrain: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: string,
    maxSpeed: number = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.useBrain = controlType == "AI";

    this.controls = new Controls(controlType);
    this.polygon = this.createPolygon();
    this.controlType = controlType;
    this.maxSpeed = maxSpeed;
  }

  update(roadBorders: Border[], traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }

    console.log({
      forward: this.controls.forward,
      reverse: this.controls.reverse,
      left: this.controls.left,
      right: this.controls.right,
    });
  }

  private move() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) < 0.01) this.speed = 0;

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += 0.03 * flip;
      if (this.controls.right) this.angle -= 0.03 * flip;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = this.damaged ? "gray" : color;
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
  }

  private assessDamage(roadBorders: Border[], traffic: Car[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }

  private createPolygon = (): Point[] => {
    const points: Point[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  };
}
