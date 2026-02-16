# 🚗 Self-Driving Car City Simulation

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Neural Networks](https://img.shields.io/badge/AI-Neural%20Networks-FF6B6B?style=for-the-badge)

**An advanced browser-based city simulation featuring AI-powered self-driving cars that navigate complex urban environments using neural networks and sensor arrays.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [How It Works](#-how-it-works) • [Technology Stack](#-technology-stack)

</div>

---

## ✨ Features

### 🏙️ **Dynamic City Environment**
- **Grid-based city layout** with multiple intersecting roads
- **3D-style buildings** with procedurally generated windows
- **Realistic road network** with lane markings and intersections
- **Infinite city expansion** with smooth camera following

### 🤖 **Intelligent AI System**
- **Neural Network Architecture**: Custom-built feedforward neural networks
- **Multi-sensor Array**: 7-ray LIDAR-like sensors with 180° field of view
- **Collision Avoidance**: Advanced pathfinding and obstacle detection
- **Adaptive Learning**: Cars respawn with improved AI after crashes
- **Real-time Decision Making**: Continuous sensor input processing

### 🚦 **Advanced Traffic Management**
- **Smart Traffic System**: AI-controlled traffic cars with collision avoidance
- **Dynamic Spawning**: Traffic cars spawn and despawn based on simulation state
- **Speed Regulation**: Traffic adapts speed based on proximity to other vehicles
- **Multi-lane Navigation**: Cars intelligently choose lanes and routes

### 📊 **Real-time Analytics Dashboard**
- **Live Statistics**: Active cars, total distance traveled, crash count, simulation time
- **Interactive Controls**: Toggle sensor visualization, pause/resume simulation
- **Performance Metrics**: Track AI performance and learning progress

### 🎨 **Beautiful Visuals**
- **Modern UI Design**: Sleek dashboard with glassmorphism effects
- **Smooth Animations**: 60 FPS rendering with optimized canvas operations
- **Color-coded Elements**: Distinct colors for AI cars, traffic, and sensors
- **Dynamic Lighting**: Gradient backgrounds and visual feedback

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

## 🧠 How It Works

### Neural Network Architecture

The AI system uses a custom-built neural network with the following structure:

```
Input Layer (7 neurons)  →  Hidden Layer (6 neurons)  →  Output Layer (4 neurons)
     ↓                            ↓                            ↓
Sensor Readings          Feature Extraction          Control Decisions
(7 ray distances)        (Pattern Recognition)       (Forward/Left/Right/Reverse)
```

### Sensor System

Each AI car is equipped with **7 sensor rays** that:
- Cast in a 180° arc in front of the car
- Detect distances to road borders and other vehicles
- Provide normalized input values (0-1) to the neural network
- Visualize detection with color-coded rays (yellow = safe, red = danger)

### Decision Making Process

1. **Sensor Reading**: Car casts rays and measures distances to obstacles
2. **Neural Network Processing**: Sensor data fed through trained network
3. **Output Interpretation**: Network outputs control signals (forward, left, right, reverse)
4. **Action Execution**: Car executes highest-confidence control action
5. **Continuous Learning**: Crashed cars respawn with mutated neural networks

### Collision Avoidance

- **Polygon-based Collision Detection**: Precise collision detection using car polygons
- **Predictive Braking**: Cars slow down when obstacles detected ahead
- **Lane Management**: Traffic cars maintain safe following distances
- **Intersection Handling**: Smart navigation through complex intersections

---

## 🏗️ Architecture

### Core Components

```
src/
├── City.ts              # City generation, roads, buildings, intersections
├── Road.ts              # Road rendering and lane management
├── Car.ts               # Car physics, AI integration, collision detection
├── Sensor.ts            # LIDAR-like sensor raycasting system
├── Network.ts           # Neural network implementation
├── TrafficManager.ts    # Traffic spawning and AI management
├── Controls.ts          # Input handling (keyboard/AI)
├── Canvas.tsx           # Main simulation loop and rendering
├── App.tsx              # React application entry point
└── utils.ts             # Math utilities (lerp, intersections, etc.)
```

### Key Classes

- **`City`**: Manages the entire city environment, generates buildings and roads
- **`Car`**: Represents vehicles with physics, sensors, and neural network brain
- **`NeuralNetwork`**: Feedforward network with ReLU activation
- **`Sensor`**: Raycasting system for obstacle detection
- **`TrafficManager`**: Handles traffic car spawning and basic AI

---

## 🎮 Controls

| Action | Description |
|--------|-------------|
| **Toggle Sensors** | Show/hide sensor ray visualization |
| **Pause/Resume** | Pause or resume the simulation |
| **Auto Camera** | Camera automatically follows the best-performing car |

---

## 📈 Performance

- **60 FPS** rendering on modern browsers
- **Optimized collision detection** using polygon intersection algorithms
- **Efficient neural network** forward propagation
- **Canvas-based rendering** for smooth animations

---

## 🔬 Technical Details

### Neural Network Implementation

- **Activation Function**: ReLU (Rectified Linear Unit)
- **Weight Initialization**: Random values between -1 and 1
- **Mutation Strategy**: Linear interpolation with random values (10% mutation rate)
- **Training**: Evolutionary approach - best performers survive crashes

### Physics System

- **Acceleration**: 0.2 units/frame²
- **Max Speed**: 3 units/frame
- **Friction**: 0.05 units/frame
- **Turning Rate**: 0.03 radians/frame

### Sensor Configuration

- **Ray Count**: 7 rays
- **Ray Length**: 200 pixels
- **Field of View**: 180° (π radians)
- **Update Rate**: Every frame (60 Hz)

---

## 🎯 Future Enhancements

- [ ] Genetic algorithm for neural network evolution
- [ ] Traffic light system at intersections
- [ ] Pedestrian simulation
- [ ] Multiple AI strategies (aggressive, defensive, balanced)
- [ ] Save/load trained neural networks
- [ ] Performance benchmarking and analytics
- [ ] 3D visualization mode
- [ ] Multiplayer mode with human drivers

---

## 🛠️ Technology Stack

- **TypeScript**: Type-safe JavaScript for robust code
- **React 19**: Modern UI framework
- **Vite**: Lightning-fast build tool
- **Canvas API**: High-performance 2D rendering
- **Tailwind CSS**: Utility-first styling
- **Custom Neural Network**: From-scratch implementation

---

## 📝 License

MIT License - feel free to use this project for learning, research, or portfolio purposes!

---

## 🙏 Acknowledgments

- Inspired by neural network and autonomous vehicle research
- Built with modern web technologies for maximum performance
- Designed to showcase AI/ML concepts in an interactive way

---

<div align="center">

**Built with ❤️ using TypeScript, React, and Neural Networks**

⭐ Star this repo if you find it interesting!

</div>
