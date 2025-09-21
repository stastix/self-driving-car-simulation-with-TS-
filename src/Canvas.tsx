import React, { useRef, useEffect } from "react";
import { Car } from "./Car";
import { Road } from "./Road";

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 200;
    const road = new Road(canvas.width / 2, canvas.width * 0.9);
    const car = new Car(road.getLAneCenter(1), 100, 30, 50, "MAIN");
    const traffic = [new Car(road.getLAneCenter(1), -100, 30, 50, "DUMMY", 2)];
    const animate = () => {
      for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
      }
      canvas.height = window.innerHeight;

      ctx.save();
      ctx.translate(0, -car.y + canvas.height * 0.7);
      car.update(road.borders, traffic);
      road.draw(ctx);
      for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red");
      }
      car.draw(ctx, "blue");
      ctx.restore();

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas id="myCanvas" ref={canvasRef} />;
};

export default CanvasComponent;
