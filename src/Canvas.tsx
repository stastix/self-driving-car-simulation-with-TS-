import React, { useRef, useEffect, useState } from "react";
import { Car } from "./Car";
import { City } from "./City";
import { TrafficManager } from "./TrafficManager";
import { NeuralNetwork } from "./Network";

interface Stats {
  activeCars: number;
  totalDistance: number;
  crashes: number;
  time: number;
}

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState<Stats>({
    activeCars: 1,
    totalDistance: 0,
    crashes: 0,
    time: 0,
  });
  const [showSensors, setShowSensors] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create city
    const city = new City(canvas.width, canvas.height);

    // Create AI cars
    const aiCars: Car[] = [];
    const carCount = 5;
    
    for (let i = 0; i < carCount; i++) {
      const road = city.roads[Math.floor(Math.random() * city.roads.length)];
      const laneIndex = Math.floor(Math.random() * road.laneCount);
      const laneCenter = road.getLaneCenter(laneIndex);
      
      let x = laneCenter.x;
      let y = laneCenter.y;
      
      if (road.isHorizontal) {
        x = (Math.random() - 0.5) * 400;
      } else {
        y = (Math.random() - 0.5) * 400;
      }

      const brain = new NeuralNetwork([7, 6, 4]);
      const car = new Car(x, y, 30, 50, "AI", 3, brain);
      
      if (road.isHorizontal) {
        car.angle = Math.random() > 0.5 ? 0 : Math.PI;
      } else {
        car.angle = Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
      }
      
      car.controls.forward = true;
      car.speed = 1;
      
      aiCars.push(car);
    }

    const trafficManager = new TrafficManager(city);

    let frameCount = 0;
    let startTime = Date.now();
    let lastCrashCount = 0;

    const animate = () => {
      if (paused) {
        requestAnimationFrame(animate);
        return;
      }

      frameCount++;
      const currentTime = (Date.now() - startTime) / 1000;

      // Beautiful night sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0a1a");
      gradient.addColorStop(0.5, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars effect
      if (frameCount % 100 === 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let i = 0; i < 50; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Camera
      const activeCars = aiCars.filter((car) => !car.damaged);
      let cameraX = 0;
      let cameraY = 0;

      if (activeCars.length > 0) {
        const bestCar = activeCars.reduce((best, car) =>
          car.distanceTraveled > best.distanceTraveled ? car : best
        );
        cameraX = bestCar.x;
        cameraY = bestCar.y;
      }

      ctx.save();
      ctx.translate(-cameraX + canvas.width / 2, -cameraY + canvas.height / 2);

      // Draw city
      city.draw(ctx);

      const allBorders = city.getAllBorders();

      // Update and draw traffic
      trafficManager.update(allBorders);
      trafficManager.draw(ctx);

      // Update AI cars
      let totalDistance = 0;
      let crashes = 0;

      aiCars.forEach((car) => {
        if (!car.damaged) {
          car.update(allBorders, [
            ...trafficManager.traffic,
            ...aiCars.filter((c) => c !== car),
          ]);
          totalDistance += car.distanceTraveled;
        } else {
          crashes++;
        }
      });

      // Draw AI cars with beautiful colors
      const carColors = ["#00d4ff", "#ff00ff", "#00ff88", "#ffaa00", "#aa00ff"];
      aiCars.forEach((car, index) => {
        const color = carColors[index % carColors.length];
        car.draw(ctx, color, showSensors && !car.damaged);
      });

      ctx.restore();

      // Respawn logic - respawn after 2 seconds (120 frames at 60fps)
      const newCrashes = aiCars.filter((car) => car.damaged).length;
      if (newCrashes !== lastCrashCount) {
        lastCrashCount = newCrashes;
      }

      // Respawn damaged cars after delay
      aiCars.forEach((car) => {
        if (car.damaged) {
          // Track crash time
          if (!(car as any).crashTime) {
            (car as any).crashTime = frameCount;
          }
          
          // Respawn after 120 frames (2 seconds)
          if (frameCount - (car as any).crashTime >= 120) {
            const road = city.roads[Math.floor(Math.random() * city.roads.length)];
            const laneIndex = Math.floor(Math.random() * road.laneCount);
            const laneCenter = road.getLaneCenter(laneIndex);

            let x = laneCenter.x;
            let y = laneCenter.y;

            if (road.isHorizontal) {
              x = (Math.random() - 0.5) * 800;
            } else {
              y = (Math.random() - 0.5) * 800;
            }

            // Mutate brain for learning
            if (car.brain) {
              NeuralNetwork.mutate(car.brain, 0.15);
            }

            // Reset car
            car.x = x;
            car.y = y;
            car.damaged = false;
            car.distanceTraveled = 0;
            car.lastX = x;
            car.lastY = y;
            car.speed = 1.5;
            car.controls.forward = true;
            car.controls.left = false;
            car.controls.right = false;
            car.controls.reverse = false;

            if (road.isHorizontal) {
              car.angle = Math.random() > 0.5 ? 0 : Math.PI;
            } else {
              car.angle = Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
            }

            // Clear crash time
            delete (car as any).crashTime;
          }
        }
      });

      setStats({
        activeCars: activeCars.length,
        totalDistance: Math.round(totalDistance),
        crashes: newCrashes,
        time: Math.round(currentTime),
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [paused, showSensors]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ 
          display: "block", 
          width: "100%", 
          height: "100%"
        }}
      />
      
      {/* Modern UI Dashboard */}
      <div className="absolute top-6 left-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md text-white p-6 rounded-2xl font-mono text-sm z-10 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🚗 City Simulation
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Cars:</span>
            <span className="text-green-400 font-bold text-lg">{stats.activeCars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Distance:</span>
            <span className="text-blue-400 font-bold">{stats.totalDistance}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Crashes:</span>
            <span className="text-red-400 font-bold">{stats.crashes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Time:</span>
            <span className="text-yellow-400 font-bold">{stats.time}s</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md text-white p-6 rounded-2xl z-10 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ⚙️ Controls
        </h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showSensors}
              onChange={(e) => setShowSensors(e.target.checked)}
              className="w-5 h-5 rounded accent-cyan-500"
            />
            <span className="group-hover:text-cyan-400 transition-colors">Show Sensors</span>
          </label>
          <button
            onClick={() => setPaused(!paused)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-6 left-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md text-white p-6 rounded-2xl text-sm z-10 max-w-md border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
        <h3 className="font-bold mb-3 text-lg bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          ℹ️ About
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Watch AI-powered self-driving cars navigate a futuristic city. 
          Cars use neural networks and advanced sensor arrays to avoid collisions 
          and navigate traffic. Cars that crash are respawned with improved AI.
        </p>
      </div>
    </div>
  );
};

export default CanvasComponent;
