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
    //this.blocked = Math.random() > 0.85;// bloquea de forma aleatoria-----------------------------------------------
    this.blocked = false
  }

  getCantidadEnCelda(){
    return this.entities.length ;
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
  async cargarSpriteAnimado() {
    const json = await PIXI.Assets.load('assets/arbol/texture.json');

    this.animaciones = {};
    this.animaciones['idle'] = json.animations["idle"];

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;
    this.sprite.loop = true;
    this.sprite.play();

    // Posicionamiento del sprite en el centro inferior de la celda
    this.sprite.x = this.x + this.width / 2;
    this.sprite.y = this.y + this.height;

    this.container.addChild(this.sprite);
    this.listo = true;
  }

}
