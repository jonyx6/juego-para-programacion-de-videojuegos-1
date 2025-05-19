class VectorFieldManager {
  constructor(juego) {
    this.juego = juego;

    /*
    VectorFieldManager necesita acceso a:
    -juego.grid → grilla con celdas y vectorField.
    -juego.ancho y juego.alto → tamaño del canvas o escenario.
    Posiblemente otros elementos si expandís funcionalidades (como animales).
    */
  }
  /*FUERA 19/05
  setupRadialVectorField() {
    const grid = this.juego.grid;
    if (!grid) return;

    const centerX = this.juego.ancho / 2;
    const centerY = this.juego.alto / 2;

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cellCenterX = col * grid.cellSize + grid.cellSize / 2;
        const cellCenterY = row * grid.cellSize + grid.cellSize / 2;

        const dx = cellCenterX - centerX;
        const dy = cellCenterY - centerY;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const strength = Math.min(1.0, 100 / dist);
          grid.setVector(col, row, {
            x: 0, // O podés usar normalizedX * strength
            y: 0,
          });
        }
      }
    }
  }*/

  updateVectorFieldBasedOnPoint(pointX, pointY) {
    const grid = this.juego.grid;
    if (!grid) return;

    const targetCol = Math.floor(pointX / grid.cellSize);
    const targetRow = Math.floor(pointY / grid.cellSize);
    const targetCellIndex = grid.getCellIndex(targetCol, targetRow);
    if (targetCellIndex === -1) return;

    const distances = new Array(grid.cells.length).fill(Infinity);
    const previous = new Array(grid.cells.length).fill(null);
    const visited = new Array(grid.cells.length).fill(false);
    const queue = [];

    distances[targetCellIndex] = 0;
    queue.push([targetCellIndex, 0]);

    while (queue.length > 0) {
      queue.sort((a, b) => a[1] - b[1]);
      const [currentCellIndex] = queue.shift();
      if (visited[currentCellIndex]) continue;
      visited[currentCellIndex] = true;

      const currentCell = grid.cells[currentCellIndex];
      if (currentCell.blocked) continue;

      const neighbors = currentCell.getNeighbors();

      for (const neighbor of neighbors) {
        const neighborIndex = grid.getCellIndex(neighbor.col, neighbor.row);
        if (neighborIndex === -1 || neighbor.blocked || visited[neighborIndex])
          continue;

        const dx = neighbor.centerX - currentCell.centerX;
        const dy = neighbor.centerY - currentCell.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const newDistance = distances[currentCellIndex] + distance;

        if (newDistance < distances[neighborIndex]) {
          distances[neighborIndex] = newDistance;
          previous[neighborIndex] = currentCellIndex;
          queue.push([neighborIndex, newDistance]);
        }
      }
    }

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      if (cell.blocked) {
        grid.setVector(cell.col, cell.row, { x: 0, y: 0 });
        continue;
      }

      if (previous[i] === null && i !== targetCellIndex) {
        grid.setVector(cell.col, cell.row, {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
        });
        continue;
      }

      if (i === targetCellIndex) {
        grid.setVector(cell.col, cell.row, {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
        });
        continue;
      }

      const nextCellIndex = previous[i];
      const nextCell = grid.cells[nextCellIndex];
      const dx = nextCell.centerX - cell.centerX;
      const dy = nextCell.centerY - cell.centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const normalizedX = dx / dist;
        const normalizedY = dy / dist;
        const distanceToTarget = distances[i];
        const strength = Math.max(0.5, Math.min(2.0, 200 / (distanceToTarget + 1)));

        grid.setVector(cell.col, cell.row, {
          x: normalizedX * strength,
          y: normalizedY * strength,
        });
      }
    }
  }
}

window.VectorFieldManager = VectorFieldManager;