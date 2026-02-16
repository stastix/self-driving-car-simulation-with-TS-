import { Road } from "./Road";
import { lerp, type Point } from "./utils";

export interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  windows: boolean[][];
}

export class City {
  roads: Road[] = [];
  buildings: Building[] = [];
  intersections: Point[] = [];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.generateCity();
  }

  private generateCity() {
    // Create a grid of roads
    const roadWidth = 200;
    const horizontalRoads = 5;
    const verticalRoads = 5;
    const spacing = 300;

    // Horizontal roads
    for (let i = 0; i < horizontalRoads; i++) {
      const y = i * spacing - (horizontalRoads - 1) * spacing / 2;
      const road = new Road(0, roadWidth, 3, true, y);
      this.roads.push(road);
    }

    // Vertical roads
    for (let i = 0; i < verticalRoads; i++) {
      const x = i * spacing - (verticalRoads - 1) * spacing / 2;
      const road = new Road(x, roadWidth, 3, false);
      this.roads.push(road);
    }

    // Generate buildings in the spaces between roads
    this.generateBuildings(roadWidth, spacing, horizontalRoads, verticalRoads);

    // Store intersections
    this.calculateIntersections();
  }

  private generateBuildings(
    roadWidth: number,
    spacing: number,
    hRoads: number,
    vRoads: number
  ) {
    const buildingColors = [
      "#1a1a2e", "#16213e", "#0f3460", "#533483",
      "#2c3e50", "#34495e", "#2c2c54", "#40407a"
    ];

    for (let i = 0; i < hRoads - 1; i++) {
      for (let j = 0; j < vRoads - 1; j++) {
        const x = j * spacing - (vRoads - 1) * spacing / 2;
        const y = i * spacing - (hRoads - 1) * spacing / 2;

        // Create 2-4 buildings per block
        const buildingCount = Math.floor(Math.random() * 3) + 2;
        for (let k = 0; k < buildingCount; k++) {
          const buildingWidth = (spacing - roadWidth) / 2 - 20;
          const buildingHeight = (spacing - roadWidth) / 2 - 20;
          const offsetX = (k % 2) * (spacing - roadWidth) / 2;
          const offsetY = Math.floor(k / 2) * (spacing - roadWidth) / 2;

          // Generate window pattern
          const windowCols = Math.floor(buildingWidth / 20);
          const windowRows = Math.floor(buildingHeight / 20);
          const windows: boolean[][] = [];
          for (let row = 0; row < windowRows; row++) {
            windows[row] = [];
            for (let col = 0; col < windowCols; col++) {
              windows[row][col] = Math.random() > 0.4; // 60% lit
            }
          }

          this.buildings.push({
            x: x + offsetX + roadWidth / 2 + 10,
            y: y + offsetY + roadWidth / 2 + 10,
            width: buildingWidth,
            height: buildingHeight,
            color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
            windows: windows
          });
        }
      }
    }
  }

  private calculateIntersections() {
    const spacing = 300;
    const horizontalRoads = 5;
    const verticalRoads = 5;

    for (let i = 0; i < horizontalRoads; i++) {
      for (let j = 0; j < verticalRoads; j++) {
        const x = j * spacing - (verticalRoads - 1) * spacing / 2;
        const y = i * spacing - (horizontalRoads - 1) * spacing / 2;
        this.intersections.push({ x, y });
      }
    }
  }

  getAllBorders() {
    const borders: Array<[Point, Point]> = [];
    this.roads.forEach((road) => {
      borders.push(...road.borders);
    });
    return borders;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw buildings with modern style
    this.buildings.forEach((building) => {
      // Building shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(
        building.x - building.width / 2 + 5,
        building.y - building.height / 2 + 5,
        building.width,
        building.height
      );

      // Building main
      ctx.fillStyle = building.color;
      ctx.fillRect(
        building.x - building.width / 2,
        building.y - building.height / 2,
        building.width,
        building.height
      );

      // Building highlight
      const gradient = ctx.createLinearGradient(
        building.x - building.width / 2,
        building.y - building.height / 2,
        building.x + building.width / 2,
        building.y - building.height / 2
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        building.x - building.width / 2,
        building.y - building.height / 2,
        building.width,
        building.height
      );

      // Windows with neon glow
      const windowSize = 10;
      const windowSpacing = 20;
      const startX = building.x - building.width / 2 + 10;
      const startY = building.y - building.height / 2 + 10;

      building.windows.forEach((row, rowIdx) => {
        row.forEach((lit, colIdx) => {
          const x = startX + colIdx * windowSpacing;
          const y = startY + rowIdx * windowSpacing;
          
          if (lit && x < building.x + building.width / 2 - 10 && y < building.y + building.height / 2 - 10) {
            // Window glow
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#fbbf24";
            ctx.fillStyle = "#fbbf24";
            ctx.fillRect(x, y, windowSize, windowSize);
            ctx.shadowBlur = 0;
          } else {
            // Dark window
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(x, y, windowSize, windowSize);
          }
        });
      });
    });

    // Draw roads
    this.roads.forEach((road) => {
      road.draw(ctx);
    });

    // Draw intersection markings with glow
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#fbbf24";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    this.intersections.forEach((intersection) => {
      ctx.beginPath();
      ctx.arc(intersection.x, intersection.y, 12, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }
}
