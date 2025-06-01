class ObjetosEscenario {
  constructor(x,y,app,juego){
    this.juego = juego;
    this.x = x ;
    this.y = y ;
    this.app = app ;
    this.sprite = null;
    this.listo = false;
    this.animaciones = {};  
    this.crearContainer();
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.container.x = this.x;
        this.container.y = this.y;
        this.app.containerPrincipal.addChild(this.container);
    }

    updateZIndex() {
        this.container.zIndex = this.y;
    }

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('arbol/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.play();
        this.listo = true;
        this.container.addChild(this.sprite)

    }

    cambiarAnimacion(nombre, haciaIzquierda = false) {
        if (this.animaciones[nombre]) {
            this.sprite.textures = this.animaciones[nombre];
            this.sprite.play();

            if (haciaIzquierda) {
                this.sprite.scale.x = -1;
                this.sprite.anchor.x = 1;
            } else {
                this.sprite.scale.x = 1;
                this.sprite.anchor.x = 0.5;
            }
        }
    }

    seleccionar() {
        // Podés mostrar un borde, sombra, o simplemente marcarlo como seleccionado
        console.log("objeto seleccionado");
        this.sprite.tint = 0x00ff00; // Lo tiñe de verde al seleccionarlo
    }
    
    deseleccionar() {
        this.sprite.tint = 0xFFFFFF; // Color original (sin tinte)
    }
    

        





































  /*constructor(x, y, juego, ancho , alto ) {
    this.x = x;
    this.y = y;
    this.juego = juego;
    this.ancho = ancho;
    this.alto = alto;
    this.seleccionado = false;
    this.animaciones = {};
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    this.sprite.on('pointerdown', () => this.seleccionar());
    juego.containerPrincipal.addChild(this.sprite);
    this.bloquearCeldasEnGrid();
  }

  async cargarSpritesAnimados() {
    let json = await PIXI.Assets.load('arbol/texture.json');
    this.animaciones['idle'] = json.animations["idle"];
    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;
    this.sprite.loop = true;
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.play();
    this.listo = true;
    this.container.addChild(this.sprite)

  }

  cambiarAnimacion(nombre, haciaIzquierda = false) {
    if (this.animaciones[nombre]) {
      this.sprite.textures = this.animaciones[nombre];
        this.sprite.play();

        if (haciaIzquierda) {
          this.sprite.scale.x = -1;
          this.sprite.anchor.x = 1;
        } else {
            this.sprite.scale.x = 1;
             this.sprite.anchor.x = 0.5;
        }
      }
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
  }*/
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