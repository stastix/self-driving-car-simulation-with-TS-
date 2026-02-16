import { Controls } from "./Controls";
import { polysIntersect, type Point } from "./utils";
import { type Border, Sensor } from "./sensor";
import { NeuralNetwork } from "./Network";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed = 0;
  acceleration = 0.2;
  maxSpeed = 3;
  friction = 0.05;
  angle = 0;
  damaged = false;
  controls: Controls;
  polygon: Point[];
  controlType: string;
  useBrain: boolean;
  sensor: Sensor | null = null;
  brain: NeuralNetwork | null = null;
  distanceTraveled = 0;
  lastX: number;
  lastY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: string,
    maxSpeed: number = 3,
    brain?: NeuralNetwork
  ) {
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.width = width;
    this.height = height;
    this.useBrain = controlType == "AI";

    this.controls = new Controls(controlType);
    this.polygon = this.createPolygon();
    this.controlType = controlType;
    this.maxSpeed = maxSpeed;

    if (this.useBrain) {
      this.sensor = new Sensor(this);
      if (brain) {
        this.brain = brain;
      } else {
        this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
      }
    }
  }

  update(roadBorders: Border[], traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
      
      const dx = this.x - this.lastX;
      const dy = this.y - this.lastY;
      this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
      this.lastX = this.x;
      this.lastY = this.y;
    }

    if (this.sensor && !this.damaged) {
      this.sensor.update(roadBorders, traffic);
      
      if (this.useBrain) {
        // Get sensor readings - offset is distance (0 = hit, 1 = far)
        const sensorValues = this.sensor.readings.map((r) => (r ? r.offset : 1));
        const offsets = sensorValues.map((v) => 1 - v); // Convert to danger (0 = safe, 1 = danger)
        const outputs = NeuralNetwork.feedForward(offsets, this.brain!);

        // Analyze front sensors for immediate danger
        const frontSensors = [
          sensorValues[Math.floor(sensorValues.length / 2)],
          sensorValues[Math.floor(sensorValues.length / 2) - 1] || 1,
          sensorValues[Math.floor(sensorValues.length / 2) + 1] || 1,
        ];
        const minFrontDistance = Math.min(...frontSensors);
        const leftDistance = sensorValues[0] || 1;
        const rightDistance = sensorValues[sensorValues.length - 1] || 1;

        // Default: always try to move forward (aggressive driving)
        this.controls.forward = true;
        this.controls.left = false;
        this.controls.right = false;
        this.controls.reverse = false;

        // Only react if obstacle is very close (0.25 = close enough to react)
        if (minFrontDistance < 0.25) {
          // Close obstacle - turn away immediately
          if (leftDistance > rightDistance) {
            this.controls.left = true;
            this.controls.forward = minFrontDistance > 0.12; // Keep moving if not too close
          } else {
            this.controls.right = true;
            this.controls.forward = minFrontDistance > 0.12;
          }
        } else {
          // Use AI for navigation when path is relatively clear
          const maxOutput = Math.max(...outputs);
          const maxIndex = outputs.indexOf(maxOutput);
          
          // Use AI decision if confident, otherwise default to forward
          if (maxOutput > 0.4) {
            this.controls.forward = maxIndex === 0;
            this.controls.left = maxIndex === 1;
            this.controls.right = maxIndex === 2;
            this.controls.reverse = maxIndex === 3 && this.speed < 0.3;
          }
          // Otherwise keep forward (default above)
        }

        // Anti-stuck: if speed is very low and path is clear, force forward
        if (this.speed < 0.2 && minFrontDistance > 0.4) {
          this.controls.forward = true;
          this.controls.left = false;
          this.controls.right = false;
        }
      }
    }
  }

  private move() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

    // Apply friction only if not accelerating
    if (!this.controls.forward && !this.controls.reverse) {
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
    }
    if (Math.abs(this.speed) < 0.01) this.speed = 0;

    // Minimum speed to prevent getting stuck
    if (this.controls.forward && this.speed < 0.5 && Math.abs(this.speed) < 0.1) {
      this.speed = 0.5;
    }

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += 0.03 * flip;
      if (this.controls.right) this.angle -= 0.03 * flip;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, color: string, drawSensor: boolean = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }

    // Car shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(this.x + 3, this.y + 3, this.width / 2, this.height / 2, this.angle, 0, Math.PI * 2);
    ctx.fill();

    if (this.damaged) {
      // Damaged car - gray with red outline
      ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
      ctx.strokeStyle = "rgba(200, 0, 0, 0.8)";
      ctx.lineWidth = 3;
    } else {
      // Healthy car with gradient
      const gradient = ctx.createLinearGradient(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, this.lightenColor(color, 20));
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = this.lightenColor(color, 40);
      ctx.lineWidth = 3;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Car highlight
    if (!this.damaged) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      ctx.lineTo(this.polygon[1].x, this.polygon[1].y);
      ctx.lineTo(
        (this.polygon[0].x + this.polygon[1].x) / 2,
        (this.polygon[0].y + this.polygon[1].y) / 2 - 5
      );
      ctx.closePath();
      ctx.fill();
    }

    // Direction indicator with glow
    if (!this.damaged) {
      ctx.shadowBlur = 5;
      ctx.shadowColor = color;
      ctx.strokeStyle = this.lightenColor(color, 60);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.sin(this.angle) * 35,
        this.y - Math.cos(this.angle) * 35
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
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
