# Self-Driving Car Simulation (TypeScript + React)

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A browser-based prototype demonstrating neural network-driven cars in a simple grid city environment.**

⚠️ **Work in Progress** - This is a learning project with known issues. See [Known Issues](#-known-issues) below.

</div>

---

## 📋 What This Is

This is a **prototype/demo project** that attempts to simulate self-driving cars using:
- Custom neural networks (feedforward architecture)
- Ray-based sensors (LIDAR-like)
- Basic physics and collision detection
- A simple grid-based city with roads and buildings

**Current State**: The simulation works but has significant limitations. Cars can navigate and avoid some collisions, but behavior is imperfect. This is primarily a learning project to understand neural networks, game physics, and canvas rendering.

---

## ✨ What Works

- ✅ **Basic City Environment**: Grid-based road system (5x5) with buildings
- ✅ **Neural Network AI**: Custom feedforward networks (7→6→4 architecture)
- ✅ **Sensor System**: 7-ray sensors that detect obstacles and road borders
- ✅ **Collision Detection**: Polygon-based collision system
- ✅ **Visual Rendering**: Canvas-based graphics with neon-style visuals
- ✅ **Basic Traffic**: Simple traffic cars that move along roads
- ✅ **UI Dashboard**: Real-time stats and controls

---

## ⚠️ Known Issues & Limitations

### Current Problems

- **Unpredictable Car Behavior**: Cars sometimes rotate meaninglessly or get stuck
- **Random Crashes**: Cars crash unexpectedly even when path appears clear
- **Spawn Issues**: Some cars don't spawn correctly or spawn off-road
- **Navigation Problems**: Cars don't always stay on roads - they may drive through buildings
- **AI Limitations**: Neural network decision-making is basic and not well-trained
- **No Real Learning**: Cars respawn with random mutations, not actual learning from experience
- **Traffic Issues**: Traffic cars have very basic AI and can cause jams

### What Needs Improvement

1. **Better AI Training**
   - Implement proper genetic algorithm or reinforcement learning
   - Save/load trained models
   - Better reward/punishment system

2. **Improved Navigation**
   - Pathfinding to keep cars on roads
   - Better intersection handling
   - Lane following logic

3. **Physics Refinement**
   - More realistic car movement
   - Better collision response
   - Improved turning mechanics

4. **Spawn System**
   - Ensure cars always spawn on valid road positions
   - Better initial positioning logic

5. **Traffic Management**
   - Smarter traffic AI
   - Traffic lights at intersections
   - Better flow control

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/self-driving-car-simulation-with-TS-.git
   cd self-driving-car-simulation-with-TS-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧠 How It Works (Simplified)

### Neural Network

```
Input (7 sensors) → Hidden Layer (6 neurons) → Output (4 controls)
```

- **Input**: Distance readings from 7 sensor rays
- **Hidden Layer**: 6 neurons with ReLU activation
- **Output**: 4 control signals (forward, left, right, reverse)

### Sensor System

Each car has 7 rays that:
- Cast in a 180° arc in front of the car
- Detect distance to obstacles (roads, other cars)
- Return normalized values (0 = hit, 1 = clear)

### Decision Making

1. Sensors read environment
2. Values fed through neural network
3. Network outputs control signals
4. Car executes highest output (with some safety overrides)
5. If car crashes, it respawns with slightly mutated network

**Note**: The "learning" is very basic - just random mutations, not actual training.

---

## 🏗️ Project Structure

```
src/
├── City.ts              # City generation (roads, buildings)
├── Road.ts              # Road rendering and lane logic
├── Car.ts               # Car physics, AI, collision detection
├── Sensor.ts            # Ray-based sensor system
├── Network.ts           # Neural network implementation
├── TrafficManager.ts    # Basic traffic car management
├── Controls.ts          # Input handling
├── Canvas.tsx           # Main rendering loop
├── App.tsx              # React app entry
└── utils.ts             # Math utilities
```

---

## 🎮 Controls

- **Toggle Sensors**: Show/hide sensor ray visualization
- **Pause/Resume**: Pause or resume the simulation
- **Camera**: Automatically follows the best-performing car

---

## 🔬 Technical Details

### Neural Network
- **Architecture**: Feedforward (7→6→4)
- **Activation**: ReLU
- **Initialization**: Random weights (-1 to 1)
- **Mutation**: 15% random mutation on respawn

### Physics
- **Acceleration**: 0.2 units/frame²
- **Max Speed**: 3 units/frame
- **Friction**: 0.05 units/frame
- **Turning**: 0.03 radians/frame

### Sensors
- **Rays**: 7
- **Range**: 200 pixels
- **Field of View**: 180°
- **Update**: Every frame (60 Hz)

---

## 🎯 Future Improvements (Roadmap)

### High Priority
- [ ] Fix spawn system to ensure cars start on roads
- [ ] Improve AI to keep cars on roads
- [ ] Better collision avoidance logic
- [ ] Reduce random rotations and stuck behavior

### Medium Priority
- [ ] Implement genetic algorithm for actual learning
- [ ] Add pathfinding for road following
- [ ] Better traffic management
- [ ] Save/load trained networks

### Low Priority
- [ ] Traffic lights at intersections
- [ ] Multiple AI strategies
- [ ] Performance optimizations
- [ ] 3D visualization option

---

## 🛠️ Technology Stack

- **TypeScript**: Type-safe JavaScript
- **React 19**: UI framework
- **Vite**: Build tool
- **Canvas API**: 2D rendering
- **Tailwind CSS**: Styling
- **Custom Neural Network**: From-scratch implementation (no ML libraries)

---

## 📝 Notes

- This is a **learning project**, not production-ready code
- The AI is **not well-trained** - it's mostly random behavior with basic obstacle avoidance
- Cars will crash frequently - this is expected with the current implementation
- The "city" is a simple grid - not a realistic urban simulation
- Performance is decent but not optimized

---

## 🤝 Contributing

This is a work-in-progress project. If you want to help improve it:
1. Focus on fixing the known issues listed above
2. Improve the AI training/learning system
3. Better navigation and pathfinding
4. Code cleanup and optimization

---

## 📝 License

MIT License - feel free to use, modify, and learn from this project!

---

## 🙏 Acknowledgments

- Built as a learning exercise for neural networks and game physics
- Inspired by various self-driving car simulation tutorials
- Uses modern web technologies for browser-based simulation

---

<div align="center">

**Built with TypeScript, React, and Custom Neural Networks**

⚠️ **Remember**: This is a prototype with known issues. Expect imperfect behavior!

</div>
