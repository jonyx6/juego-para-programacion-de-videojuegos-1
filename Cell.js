// original

class Cell {
  constructor(col, row, size, grid) {
    this.col = col;
    this.row = row;
    this.size = size;
    this.grid = grid;
    this.entities = [];

    // Position in world coordinates
    this.x = col * size;
    this.y = row * size;
    this.width = size;
    this.height = size;

    // Center point of the cell
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.blocked = Math.random() > 0.7;// bloquea de forma aleatoria-----------------------------------------------
    //this.blocked = false
  }

  // Add an entity to this cell
  addEntity(entity) {
    if (!this.entities.includes(entity)) {
      this.entities.push(entity);
      entity.cell = this;
    }
  }

  // Remove an entity from this cell
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      if (entity.cell === this) {
        entity.cell = null;
      }
    }
  }

  // Check if a point is inside this cell
  containsPoint(x, y) {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    );
  }

  // Get neighboring cells-----------------------------------
  //v1
  getNeighbors() {
    const neighbors = [];
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const neighborCol = this.col + dx;
      const neighborRow = this.row + dy;
      const index = this.grid.getCellIndex(neighborCol, neighborRow);

      if (index !== -1) {
        neighbors.push(this.grid.cells[index]);
      }
    }

    return neighbors;
  }
  //v2
  getNeighbors_v2() {
    const vecinos = [];
    const { col, row, grid } = this;

    const cardinales = [
      { dx: -1, dy:  0 }, // izquierda
      { dx:  1, dy:  0 }, // derecha
      { dx:  0, dy: -1 }, // arriba
      { dx:  0, dy:  1 }, // abajo
    ];

    const diagonales = [
      { dx: -1, dy: -1 }, // arriba izquierda
      { dx:  1, dy: -1 }, // arriba derecha
      { dx: -1, dy:  1 }, // abajo izquierda
      { dx:  1, dy:  1 }, // abajo derecha
    ];

    // Primero agregamos vecinos cardinales válidos
    for (const { dx, dy } of cardinales) {
      const vecino = grid.getCellAt(col + dx, row + dy);
      if (vecino && !vecino.blocked) {
        vecinos.push(vecino);
      }
    }

    // Luego agregamos diagonales solo si los laterales están libres
    for (const { dx, dy } of diagonales) {
      const vecino = grid.getCellAt(col + dx, row + dy);
      if (!vecino || vecino.blocked) continue;

      const lateralA = grid.getCellAt(col + dx, row);     // horizontal
      const lateralB = grid.getCellAt(col, row + dy);     // vertical

      const libres = lateralA && !lateralA.blocked && lateralB && !lateralB.blocked;

      if (libres) {
        vecinos.push(vecino);
      }
    }

    return vecinos;
  }

  // Get all entities in this cell and neighboring cells
  getEntitiesInNeighborhood() {
    const result = [...this.entities];
    const neighbors = this.getNeighbors();

    for (const neighbor of neighbors) {
      result.push(...neighbor.entities);
    }

    return result;
  }

  // Render the cell for debugging (optional)
  render(graphics, highlight = false) {
    // Draw blocked cells as white squares
    if (this.blocked) {
      graphics.beginFill(0xffffff, 0.8);
      graphics.drawRect(this.x, this.y, this.width, this.height);
      graphics.endFill();
      return;
    }

    // Only draw the border without filling for non-blocked cells
    if (highlight) {
      graphics.lineStyle(2, 0xff0000, 0.8);
    } else if (this.entities.length > 0) {
      // Brighter border for cells with entities
      graphics.lineStyle(
        1,
        0x00ff00,
        0.5 + Math.min(this.entities.length * 0.1, 0.5)
      );
    } else {
      graphics.lineStyle(1, 0x666666, 0.3);
    }

    graphics.drawRect(this.x, this.y, this.width, this.height);

    // No fill needed
    // No endFill needed since we're not filling
  }
}

//v3
/*
class Cell {
  constructor(col, row, size, grid) {
    this.col = col;
    this.row = row;
    this.size = size;
    this.grid = grid;

    // Posición en coordenadas del mundo
    this.x = col * size;
    this.y = row * size;
    this.width = size;
    this.height = size;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;

    this.entities = [];
    this.blocked = false; // ← no más bloqueo aleatorio
    //this.blocked = Math.random() > 0.7;

    // Propiedades para A*
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = null;
  }

  // Añadir entidad a esta celda
  addEntity(entity) {
    if (!this.entities.includes(entity)) {
      this.entities.push(entity);
      entity.cell = this;
    }
  }

  // Remover entidad de esta celda
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      if (entity.cell === this) {
        entity.cell = null;
      }
    }
  }

  // Verifica si un punto está dentro de esta celda
  containsPoint(x, y) {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    );
  }

  // Obtener vecinos válidos (para pathfinding)
  getNeighbors() {
    const vecinos = [];
    const { col, row, grid } = this;

    const cardinales = [
      { dx: -1, dy: 0 },  // izquierda
      { dx: 1, dy: 0 },   // derecha
      { dx: 0, dy: -1 },  // arriba
      { dx: 0, dy: 1 },   // abajo
    ];

    const diagonales = [
      { dx: -1, dy: -1 }, // arriba izquierda
      { dx: 1, dy: -1 },  // arriba derecha
      { dx: -1, dy: 1 },  // abajo izquierda
      { dx: 1, dy: 1 },   // abajo derecha
    ];

    // Cardinales primero
    for (const { dx, dy } of cardinales) {
      const vecino = grid.getCellAt(col + dx, row + dy);
      if (vecino && !vecino.blocked) {
        vecinos.push(vecino);
      }
    }

    // Diagonales solo si los laterales están libres
    for (const { dx, dy } of diagonales) {
      const vecino = grid.getCellAt(col + dx, row + dy);
      if (!vecino || vecino.blocked) continue;

      const lateralA = grid.getCellAt(col + dx, row); // horizontal
      const lateralB = grid.getCellAt(col, row + dy); // vertical

      const libres = lateralA && !lateralA.blocked && lateralB && !lateralB.blocked;
      if (libres) {
        vecinos.push(vecino);
      }
    }

    return vecinos;
  }

  // Entidades en esta celda y vecinas
  getEntitiesInNeighborhood() {
    const result = [...this.entities];
    const neighbors = this.getNeighbors();

    for (const neighbor of neighbors) {
      result.push(...neighbor.entities);
    }

    return result;
  }

  // Renderizado para depuración
  render(graphics, highlight = false) {
    if (this.blocked) {
      graphics.beginFill(0xffffff, 0.8);
      graphics.drawRect(this.x, this.y, this.width, this.height);
      graphics.endFill();
      return;
    }

    if (highlight) {
      graphics.lineStyle(2, 0xff0000, 0.8);
    } else if (this.entities.length > 0) {
      graphics.lineStyle(
        1,
        0x00ff00,
        0.5 + Math.min(this.entities.length * 0.1, 0.5)
      );
    } else {
      graphics.lineStyle(1, 0x666666, 0.3);
    }

    graphics.drawRect(this.x, this.y, this.width, this.height);
  }
}
*/