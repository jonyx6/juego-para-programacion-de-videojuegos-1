class ObjetosEscenario {//10/06/2025---------
  constructor(juego, col, row) {
    this.juego = juego;
    this.col = col;
    this.row = row;
    this.sprite = null;
    this.listo = false;
    this.animaciones = {};
    this.ancho = 0;
    this.alto = 0;

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

    cambiarOrdenEnZ() {
    this.container.zIndex = this.y + 100;
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

    setSeleccionado(estado) {
      if (this.sprite) {
        this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
        if (estado) this.emitirSonidoAleatorio();
      }
    }
    
  deseleccionar() {
      this.sprite.tint = 0xFFFFFF; // Color original (sin tinte)
  }
//--10/06/2025-------------------------------------------------------nuevos metodos sacados de juego
  crearContainer() {
    this.container = new PIXI.Container();
    this.juego.containerPrincipal.addChild(this.container);
  }

  async inicializar() {
    await this.cargarSprite();     // Este método lo define cada subclase
    this.colocarEnCelda(this.col, this.row);
    this.registrarseEnGrid();
  }

  colocarEnCelda(col, row) {
    const cellSize = this.juego.grid.cellSize;

    const x = (col + 1) * cellSize;
    const y = (row + 2) * cellSize;

    this.container.x = x;
    this.container.y = y;
  }

  registrarseEnGrid() {
    const xSuperiorIzq = this.container.x - this.ancho / 2;
    const ySuperiorIzq = this.container.y - this.alto;

    const celdas = this.juego.grid.getCeldasOcupadasPorSprite(
      xSuperiorIzq,
      ySuperiorIzq,
      this.ancho,
      this.alto
    );

    for (const celda of celdas) {
      celda.blocked = true;
      this.juego.grid.bloquearCelda(celda.col, celda.row);
      celda.addEntity(this);
    }
  }

  obtenerCeldasOcupadas() {
    const xSuperiorIzq = this.container.x - this.ancho / 2;
    const ySuperiorIzq = this.container.y - this.alto;

    return this.juego.grid.getCeldasOcupadasPorSprite(
      xSuperiorIzq,
      ySuperiorIzq,
      this.ancho,
      this.alto
    );
  }

  obtenerCeldasVecinasLibres() {
    const celdasOcupadas = this.obtenerCeldasOcupadas();
    const celdasVecinas = new Set();

    for (const celda of celdasOcupadas) {
      const vecinos = this.juego.grid.getVecinos(celda);
      for (const v of vecinos) {
        if (!v.blocked) {
          celdasVecinas.add(v);
        }
      }
    }

    return [...celdasVecinas];
  }

  recibirDanio(cantidad) {
    console.log("🔥 Recibiendo daño:", cantidad);
    this.vida -= cantidad;

    if (this.vida <= 0) {
      this.morir();
    } else {
      // 👇 ESTA LÍNEA NO:
      // this.setSeleccionado(true);

      // ✅ Opcional: pequeño efecto visual para "recibir daño"
      this.sprite.tint = 0xffaaaa;
      setTimeout(() => {
        this.sprite.tint = 0xFFFFFF;
      }, 100);
    }
  }

  morirV1() {
    // 1. Eliminar del contenedor visual
    if (this.container && this.container.parent) {
      this.container.parent.removeChild(this.container);
      this.container.destroy({ children: true });
    }

    // 2. Remover del array global de objetos
    const listaGeneral = this.juego.objetosDeEscenario;
    const indexGeneral = listaGeneral.indexOf(this);
    if (indexGeneral !== -1) listaGeneral.splice(indexGeneral, 1);

    // 3. Remover del array azul si está
    const listaAzules = this.juego.objetosDeEscenarioAzules;
    const indexAzul = listaAzules.indexOf(this);
    if (indexAzul !== -1) listaAzules.splice(indexAzul, 1);

    // 4. Liberar celdas bloqueadas
    const xSuperiorIzq = this.container.x - this.ancho / 2;
    const ySuperiorIzq = this.container.y - this.alto;

    const celdas = this.juego.grid.getCeldasOcupadasPorSprite(
      xSuperiorIzq,
      ySuperiorIzq,
      this.ancho,
      this.alto
    );

    for (const celda of celdas) {
      celda.blocked = false;
      celda.removeEntity?.(this); // si existe el método
    }

    console.log("Estructura destruida.");
  }

  morir() {
    // 1. Liberar celdas primero
    const xSuperiorIzq = this.container.x - this.ancho / 2;
    const ySuperiorIzq = this.container.y - this.alto;

    const celdas = this.juego.grid.getCeldasOcupadasPorSprite(
      xSuperiorIzq,
      ySuperiorIzq,
      this.ancho,
      this.alto
    );

    for (const celda of celdas) {
      celda.blocked = false;
      celda.removeEntity?.(this); // proteger si no existe
    }

    // 2. Remover del contenedor visual
    if (this.container && this.container.parent) {
      this.container.parent.removeChild(this.container);
      this.container.destroy({ children: true });
    }

    // 3. Quitar de arrays
    const listaGeneral = this.juego.objetosDeEscenario;
    const indexGeneral = listaGeneral.indexOf(this);
    if (indexGeneral !== -1) listaGeneral.splice(indexGeneral, 1);

    const listaAzules = this.juego.objetosDeEscenarioAzules;
    const indexAzul = listaAzules.indexOf(this);
    if (indexAzul !== -1) listaAzules.splice(indexAzul, 1);

    console.log("Estructura destruida correctamente.");
  }
//--------------------------------------------------------------------------------
}
window.ObjetosEscenario = ObjetosEscenario;