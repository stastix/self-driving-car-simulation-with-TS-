# Self-Driving Car Simulation (TypeScript + React)

This project is a browser-based self-driving car simulation built entirely with TypeScript and React. It currently features:

- Realistic road and lane rendering
- Traffic cars (dummy cars) and collision detection
- Physics-based car movement and driving mechanics
- Interactive sensor system (LIDAR-like rays) for each car

**Note:** Neural network AI and training are not yet implemented. The current focus is on the driving, collision, and sensor systems. Neural network-based autonomous driving will be added in a future update.

---

## Features

- **Pure TypeScript/React**: All simulation logic is implemented from scratch in TypeScript. No external ML libraries are used.
- **Interactive Visualization**: See cars drive on a rendered road, with real-time sensor rays and collision feedback.
- **Traffic and Collision**: Multiple cars (including dummy traffic) interact and collide realistically.
- **Customizable Parameters**: Easily adjust car, sensor, and road parameters.

---

## Architecture Overview

```mermaid
graph TD
  A[App (React)] -->|Renders| B(CanvasComponent)
  B -->|Draws| C[Road]
  B -->|Draws| D[Car]
  D -->|Has| E[Sensor]
  D -->|Has| F[Controls]
  D -->|Interacts| G[Road Borders]
  D -->|Interacts| H[Traffic Cars]
  E -->|Detects| G
  E -->|Detects| H
```

---

## Main Components

- **App / CanvasComponent**: Top-level React components that set up the simulation and rendering loop.
- **Road**: Handles lane layout, drawing, and border collision logic.
- **Car**: Represents each vehicle, including position, physics, and drawing. Cars can be user-controlled or dummy traffic.
- **Sensor**: Simulates LIDAR-like rays to detect road borders and obstacles.
- **Controls**: Handles user input for manual driving.

---

## How It Works

1. **Initialization**: The app creates a road and a set of cars (user and dummy traffic).
2. **Simulation Loop**: On each animation frame:

- Sensors collect data about the environment (distances to borders/traffic).
- The car updates its position and checks for collisions.
- Traffic cars move along predefined paths.

---

## Example Screenshot

<!-- Add a screenshot to public/screenshot.png to display it here -->

![Simulation Screenshot](public/screenshot.png)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open your browser to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Customization

- Adjust car and sensor parameters in `src/Car.ts` and `src/Sensor.ts`.
- Tweak road and traffic settings in `src/Road.ts` and the main app.

---

## Project Structure

```
src/
  App.tsx            # Main React app
  Canvas.tsx         # Canvas rendering and animation
  Car.ts             # Car logic and physics
  Controls.ts        # User/AI controls
  NeuralNetwork.ts   # Neural network implementation
  Road.ts            # Road and lane logic
  Sensor.ts          # Sensor (raycasting) logic
  utils.ts           # Math and helper functions
public/
  screenshot.png     # Example simulation screenshot
```

---

## License

MIT. Educational use encouraged!
