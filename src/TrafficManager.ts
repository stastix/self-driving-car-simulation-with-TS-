import { Car } from "./Car";
import { City } from "./City";
import { type Point } from "./utils";

export class TrafficManager {
  traffic: Car[] = [];
  city: City;
  spawnRate: number = 0.02;
  maxTraffic: number = 20;

  constructor(city: City) {
    this.city = city;
    this.initializeTraffic();
  }

  private initializeTraffic() {
    // Spawn initial traffic cars at different road positions
    for (let i = 0; i < 10; i++) {
      this.spawnTrafficCar();
    }
  }

  private spawnTrafficCar() {
    if (this.traffic.length >= this.maxTraffic) return;

    const road = this.city.roads[
      Math.floor(Math.random() * this.city.roads.length)
    ];
    const laneIndex = Math.floor(Math.random() * road.laneCount);
    const laneCenter = road.getLaneCenter(laneIndex);

    // Random position along the road
    let x = laneCenter.x;
    let y = laneCenter.y;
    
    if (road.isHorizontal) {
      x = (Math.random() - 0.5) * 2000;
    } else {
      y = (Math.random() - 0.5) * 2000;
    }

    // Random speed between 1.5 and 2.5
    const speed = 1.5 + Math.random();
    const car = new Car(x, y, 30, 50, "DUMMY", speed);
    
    // Set initial direction based on road orientation
    if (road.isHorizontal) {
      car.angle = Math.random() > 0.5 ? 0 : Math.PI;
    } else {
      car.angle = Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
    }

    this.traffic.push(car);
  }

  update(roadBorders: Array<[Point, Point]>) {
    // Remove damaged cars
    this.traffic = this.traffic.filter((car) => !car.damaged);

    // Spawn new traffic
    if (Math.random() < this.spawnRate && this.traffic.length < this.maxTraffic) {
      this.spawnTrafficCar();
    }

    // Update all traffic cars with simple AI to avoid crashes
    this.traffic.forEach((car) => {
      // Simple collision avoidance
      const nearbyCars = this.traffic.filter((other) => {
        if (other === car) return false;
        const dx = other.x - car.x;
        const dy = other.y - car.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 100;
      });

      // Adjust speed based on nearby cars
      let shouldSlowDown = false;
      nearbyCars.forEach((other) => {
        const dx = other.x - car.x;
        const dy = other.y - car.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleToOther = Math.atan2(dy, dx);
        const relativeAngle = Math.abs(angleToOther - car.angle);

        // If car is ahead and close, slow down
        if (relativeAngle < Math.PI / 4 && distance < 80) {
          shouldSlowDown = true;
        }
      });

      if (shouldSlowDown) {
        car.controls.forward = false;
        if (car.speed > 0.5) {
          car.speed *= 0.95;
        }
      } else {
        car.controls.forward = true;
      }

      car.update(roadBorders, this.traffic.filter((c) => c !== car));
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.traffic.forEach((car) => {
      car.draw(ctx, "#e74c3c");
    });
  }
}

