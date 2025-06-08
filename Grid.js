// v2
class Grid {
  constructor(juego, cols, rows, cellSize) {
    this.juego = juego;
    this.cellSize = cellSize;

    this.cols = cols;
    this.rows = rows;

    this.cells = this.crearCeldas();
    this.vectorField = this.crearCampoVectorial();//----------no lo usa A*
    this.visible = true;
  }
  // === Inicialización ===
  crearCeldas() {
    const celdas = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        celdas.push(new Cell(x, y, this.cellSize, this));
      }
    }
    return celdas;
  }

  getCell(col, row) {
    const index = this.getCellIndex(col, row);
    return index !== -1 ? this.cells[index] : null;
  }


  crearCampoVectorial() {
    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({ x: 0, y: 0 }))
    );
  }

  // === Acceso a celdas ===
  getCellIndex(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return -1;
    return row * this.cols + col;
  }

  getCellAt(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    const index = this.getCellIndex(col, row);
    return index !== -1 ? this.cells[index] : null;
  }

  // === Entidades ===
  getEntitiesInCell(col, row) {
    const index = this.getCellIndex(col, row);
    return index !== -1 ? this.cells[index].entities : [];
  }

  getEntitiesInNeighborhood(col, row) {
    const entidades = [];
    for (let y = Math.max(0, row - 1); y <= Math.min(this.rows - 1, row + 1); y++) {
      for (let x = Math.max(0, col - 1); x <= Math.min(this.cols - 1, col + 1); x++) {
        entidades.push(...this.getEntitiesInCell(x, y));
      }
    }
    return entidades;
  }

  addEntity(entity) {
    const cell = this.getCellAt(entity.x, entity.y);
    if (cell) cell.addEntity(entity);
  }

  updateEntity(entity, oldX, oldY) {
    const oldCell = this.getCellAt(oldX, oldY);
    const newCell = this.getCellAt(entity.x, entity.y);

    if (oldCell !== newCell) {
      oldCell?.removeEntity(entity);
      newCell?.addEntity(entity);
    }
  }

  // === Campo vectorial === -------------no lo usa A*
  getVectorAt(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return { x: 0, y: 0 };
    }
    return this.vectorField[row][col];
  }
  //--------------------------------------no lo usa A*
  setVector(col, row, vector) {
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.vectorField[row][col] = vector;
    }
  }

  // === Debug visual ===
  render(graphics) {
    // if (!this.visible) return;
    this.renderVectorField(graphics);
  }
  //--------------------------------------no lo usa A*
  renderVectorField(graphics) {
    const arrowLength = this.cellSize * 0.4;
    graphics.lineStyle(1, 0xffffff, 0.7);

    for (let row = 0; row < this.rows; row++) {
      const yPixel = row * this.cellSize;
      for (let col = 0; col < this.cols; col++) {
        const cell = this.cells[row * this.cols + col];

        if (cell?.blocked) {
          if (yPixel >= 700) {
            // Saltar esta celda, no dibujar nada si está bloqueada y Y >= 700
            continue;
          }
          // dibuja el cuadro
          /*graphics.beginFill(0xffffff, 0.8);
          graphics.drawRect(col * this.cellSize, yPixel, this.cellSize, this.cellSize);
          graphics.endFill();*/
          continue;
        }

        // El resto del render para vectores (si usas)...
        const vector = this.vectorField[row][col];
        const mag = Math.hypot(vector.x, vector.y);
        if (mag < 0.01) continue;

        const centerX = col * this.cellSize + this.cellSize / 2;
        const centerY = yPixel + this.cellSize / 2;

        const normX = vector.x / mag;
        const normY = vector.y / mag;

        const endX = centerX + normX * arrowLength;
        const endY = centerY + normY * arrowLength;

        graphics.moveTo(centerX, centerY);
        graphics.lineTo(endX, endY);

        const headLength = arrowLength * 0.3;
        const angle = Math.atan2(normY, normX);

        graphics.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );

        graphics.moveTo(endX, endY);

        graphics.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
      }
    }

    graphics.stroke({ width: 1, color: 0xffd900 });
  }



  // === Pathfinding ===
  // --- Dijkstra --- original
  /*
  calcularCaminoDesdeHasta(origen, destino) {
    const totalCeldas = this.cells.length;
    const gScore = new Array(totalCeldas).fill(Infinity);
    const fScore = new Array(totalCeldas).fill(Infinity);
    const anterior = new Array(totalCeldas).fill(null);
    const visitados = new Set();
    const abiertos = [];

    const origenIdx = this.getCellIndex(origen.col, origen.row);
    const destinoIdx = this.getCellIndex(destino.col, destino.row);

    gScore[origenIdx] = 0;
    fScore[origenIdx] = this.calcularHeuristica(origen, destino);
    abiertos.push([origenIdx, fScore[origenIdx]]);

    while (abiertos.length > 0) {
      // Ordenar por menor fScore
      abiertos.sort((a, b) => a[1] - b[1]);
      const [actualIdx] = abiertos.shift();

      if (actualIdx === destinoIdx) break;
      if (visitados.has(actualIdx)) continue;
      visitados.add(actualIdx);

      const actual = this.cells[actualIdx];
      if (actual.blocked) continue;

      for (const vecino of actual.getNeighbors()) {
        const vecinoIdx = this.getCellIndex(vecino.col, vecino.row);
        if (vecino.blocked || visitados.has(vecinoIdx)) continue;

        const dx = vecino.centerX - actual.centerX;
        const dy = vecino.centerY - actual.centerY;
        const costo = Math.hypot(dx, dy);
        const tentativeG = gScore[actualIdx] + costo;

        if (tentativeG < gScore[vecinoIdx]) {
          anterior[vecinoIdx] = actualIdx;
          gScore[vecinoIdx] = tentativeG;
          fScore[vecinoIdx] = tentativeG + this.calcularHeuristica(vecino, destino);

          abiertos.push([vecinoIdx, fScore[vecinoIdx]]);
        }
      }
    }

    // Reconstrucción del camino
    const path = [];
    let idx = destinoIdx;
    while (idx !== null && idx !== origenIdx) {
      path.unshift(this.cells[idx]);
      idx = anterior[idx];
    }
    return path;
  }
  */

  // --- A* --- nuevo
  calcularCaminoDesdeHasta(origen, destino) {
    const totalCeldas = this.cells.length;

  const gScore = new Array(totalCeldas).fill(Infinity); // Costo desde el origen
  const fScore = new Array(totalCeldas).fill(Infinity); // Costo estimado total (g + h)
  const anterior = new Array(totalCeldas).fill(null);
  const visitados = new Set();
  const abiertos = [];

  const origenIdx = this.getCellIndex(origen.col, origen.row);
  const destinoIdx = this.getCellIndex(destino.col, destino.row);

  gScore[origenIdx] = 0;
  fScore[origenIdx] = this.calcularHeuristica(origen, destino);
  abiertos.push([origenIdx, fScore[origenIdx]]);

  while (abiertos.length > 0) {
    // Ordenar por menor fScore
    abiertos.sort((a, b) => a[1] - b[1]);
    const [actualIdx] = abiertos.shift();
    const actual = this.cells[actualIdx];

    if (actualIdx === destinoIdx) break;
    if (actual.blocked || visitados.has(actualIdx)) continue;

    visitados.add(actualIdx);

    for (const vecino of actual.getNeighbors()) {
      const vecinoIdx = this.getCellIndex(vecino.col, vecino.row);
      if (vecino.blocked || visitados.has(vecinoIdx)) continue;

      const costoMovimiento = this.distanciaEntre(actual, vecino);
      const tentativeG = gScore[actualIdx] + costoMovimiento;

      if (tentativeG < gScore[vecinoIdx]) {
        anterior[vecinoIdx] = actualIdx;
        gScore[vecinoIdx] = tentativeG;
        fScore[vecinoIdx] = tentativeG + this.calcularHeuristica(vecino, destino);

        const yaEnAbiertos = abiertos.some(([idx]) => idx === vecinoIdx);
        if (!yaEnAbiertos) {
          abiertos.push([vecinoIdx, fScore[vecinoIdx]]);
        }
      }
    }
  }

  return this.reconstruirCamino(anterior, origenIdx, destinoIdx);
  }

  calcularHeuristica(a, b) {
  const dx = Math.abs(a.col - b.col);
  const dy = Math.abs(a.row - b.row);
  return Math.hypot(dx, dy); // Euclidiana, podés usar dx + dy si preferís Manhattan
  }

  distanciaEntre(a, b) {
  const dx = b.centerX - a.centerX;
  const dy = b.centerY - a.centerY;
  return Math.hypot(dx, dy);
  }

  reconstruirCamino(anterior, origenIdx, destinoIdx) {
  const camino = [];
  let actual = destinoIdx;

  while (actual !== null && actual !== origenIdx) {
    camino.unshift(this.cells[actual]);
    actual = anterior[actual];
  }

  return camino;
  }

  //bloqueo
  bloquearCelda(col, row) {
    const index = this.getCellIndex(col, row);
    if (index !== -1) {
      this.cells[index].blocked = true;
    }
  }

 //////////////////////
  getCeldasOcupadasPorSprite(x, y, width, height) {
    const celdas = [];
    const celdaSize = this.cellSize;

    const colInicio = Math.floor(x / celdaSize);
    const rowInicio = Math.floor(y / celdaSize);
    const colFin = Math.ceil((x + width) / celdaSize) - 1;
    const rowFin = Math.ceil((y + height) / celdaSize) - 1;

    for (let col = colInicio; col <= colFin; col++) {
      for (let row = rowInicio; row <= rowFin; row++) {
        const celda = this.getCell(col, row);
        if (celda) celdas.push(celda);
      }
    }
    return celdas;
  }

  bloquearCeldasPorAltura(maxY) {
    for (let row = 0; row < this.rows; row++) {
      const yPixel = row * this.cellSize;
      if (yPixel <= maxY) {
        for (let col = 0; col < this.cols; col++) {
          this.bloquearCelda(col, row);
        }
      }
    }
  }


}

