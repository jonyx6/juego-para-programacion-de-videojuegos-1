class ObjetosEscenario {
  constructor(x, y, juego, ancho = 1, alto = 1) {
    this.x = x;
    this.y = y;
    this.juego = juego;
    this.ancho = ancho;
    this.alto = alto;
    this.seleccionado = false;

    this.sprite = this.crearSprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    this.sprite.on('pointerdown', () => this.seleccionar());

    juego.containerPrincipal.addChild(this.sprite);

    this.bloquearCeldasEnGrid();
  }

  crearSprite() {
    const g = new PIXI.Graphics();
    g.beginFill(0x8B4513); // Marrón (como árbol/casa)
    g.drawRect(0, 0, this.juego.grid.cellSize * this.ancho, this.juego.grid.cellSize * this.alto);
    g.endFill();
    return g;
  }

  bloquearCeldasEnGrid() {
    const grid = this.juego.grid;
    const cellSize = grid.cellSize;

    const colInicio = Math.floor(this.x / cellSize);
    const rowInicio = Math.floor(this.y / cellSize);

    for (let dx = 0; dx < this.ancho; dx++) {
      for (let dy = 0; dy < this.alto; dy++) {
        const col = colInicio + dx;
        const row = rowInicio + dy;
        const celda = grid.getCellAt(col * cellSize, row * cellSize);
        if (celda) celda.blocked = true;
      }
    }
  }

  seleccionar() {
    this.deseleccionarOtros();
    this.seleccionado = true;
    this.sprite.tint = 0x00ff00; // Verde
    console.log(`Objeto seleccionado en (${this.x}, ${this.y})`);
  }

  deseleccionar() {
    this.seleccionado = false;
    this.sprite.tint = 0xFFFFFF; // Normal
  }

  deseleccionarOtros() {
    if (this.juego.objetosDeEscenario) {
      for (const obj of this.juego.objetosDeEscenario) {
        if (obj !== this) {
          obj.deseleccionar();
        }
      }
    }
  }
}

window.ObjetosEscenario = ObjetosEscenario;


/*
Asegurate de tener este array en tu clase Juego:
this.objetosDeEscenario = [];


Cuando crees objetos:
const obj = new ObjetosEscenario(200, 200, this, 2, 2);


En index.html
Agregá el archivo:
<script src="objetosEscenario.js"></script>
*/