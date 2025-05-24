class Juego {
  constructor() {
    // Dimensiones del canvas
    this.ancho = 1280;
    this.alto = 720;

    // App principal de PIXI
    this.app = new PIXI.Application();

    // Posición del mouse (absoluta y relativa al canvas)
    this.mousePos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };

    // Control de cámara y animación
    this.contadorDeFrame = 0;
    this.velocidadCamara = 15;

    // Arreglos de personajes
    this.entidades = [];              // Todos los personajes
    this.caballerosAzules = [];       // Solo los caballeros azules
    this.soldadosAzules = [];       
    this.caballerosRojos = [];        // Solo los caballeros rojos
    this.trabajadoresRojos = [];      // Solo los trabajadores
    this.soldadosRojos = []; 

    // Datos de selección con mouse
    this.selectedEntities = [];
    this.selectionBox = null;
    this.isSelecting = false;

    // Iniciar escucha de movimiento del mouse
    this.escucharMovimientoMouse();

    // Iniciar la app de PIXI y luego cargar el juego
    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.inicializarJuego();
    });
  }

  // Escucha la posición del mouse en todo momento
  escucharMovimientoMouse() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.app.view.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
    });
  }

  // Método principal que inicia toda la lógica del juego
  inicializarJuego() {
    document.body.appendChild(this.app.canvas);
    window.__PIXI_APP__ = this.app;
    this.ponerFondo();// mas al fondo. es importante el orden--
    this.crearContainerPrincipal();
    this.instanciarComponentes();
    //paredes de grid
    //const generador = new GeneradorParedesAleatorias(this.grid);
    //generador.aplicar(previous, targetCellIndex);
    this.generadorParedes = new GeneradorParedesAleatorias(this.grid);//v3 que no funciona
    this.generadorParedes.generarParedesAleatorias(0.2); 

    this.crearEntidades();

    // Iniciar el ciclo de juego (game loop)
    this.app.ticker.add(() => this.gameLoop());

    // Prevenir menú contextual con clic derecho
    this.app.view.addEventListener('contextmenu', (e) => e.preventDefault());
    this.debugGraphics = new PIXI.Graphics();
    this.debugGraphics.zIndex = 10;
    this.containerPrincipal.addChild(this.debugGraphics);

  }

  // Crea el contenedor principal donde se agregan todos los elementos del juego
  crearContainerPrincipal() {
    this.containerPrincipal = new PIXI.Container();
    this.containerPrincipal.name = "containerPrincipal";
    this.containerPrincipal.sortableChildren = true; // Permite ordenar por zIndex
    this.app.stage.addChild(this.containerPrincipal);
  }

  // Instancia los módulos necesarios para el juego (grilla, mouse, campo vectorial)
  instanciarComponentes() {
    this.grid = new Grid(this);
    //this.vectorFieldManager = new VectorFieldManager(this);// --------------------------------------------------no lo usa A*
    this.mouseManager = new MouseManager(this);
  }

  // Carga y agrega el fondo del mapa
  async ponerFondo() {
    const textura = await PIXI.Assets.load("map1.png");
    this.fondo = new PIXI.TilingSprite(textura, this.ancho * 2, this.alto * 2);
    this.fondo.zIndex = 0;
    this.containerPrincipal.addChild(this.fondo);
  }

  // Crea los personajes iniciales del juego
  crearEntidades() {
    //this.crearTrabajadoresRojos(1);
    this.crearCaballerosAzules(3);
    //this.crearCaballerosRojos(5);
    this.crearSoldadosAzules(3)
    this.crearSoldadosRojos(3)
  }

  // Ciclo principal del juego (se ejecuta en cada frame)
  gameLoop(time) {
    this.time = time;
    this.contadorDeFrame++;

    // Actualizar todas las entidades (personajes)
    for (const entidad of this.entidades) {
      entidad.update(time);

    this.debugGraphics.clear();
    this.grid.render(this.debugGraphics);

    }

    // Mover la cámara si el mouse está en los bordes
    this.moverCamara();
  }

  // === Métodos para crear personajes ===----------------------------------------------------------------------------------------------

  // Crea caballeros azules
  crearCaballerosAzulesV1(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidad(CaballeroAzul, i);
      this.caballerosAzules.push(caballero);
    }
  }
  crearCaballerosAzules(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidad(CaballeroAzul, i);
      caballero.enemigos = () => [
        ...this.caballerosRojos,
        ...this.trabajadoresRojos
      ];
      this.caballerosAzules.push(caballero);
    }
  }

  crearSoldadosAzules(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const soldado = this.crearEntidad(SoldadoAzul, i);
      soldado.enemigos = () => [
        ...this.caballerosRojos,
        ...this.soldadosRojos,
        ...this.trabajadoresRojos
      ];
      this.soldadosAzules.push(soldado);
    }
  }

  // Crea caballeros rojos
  crearCaballerosRojosV1(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidad(CaballeroRojo, i);
      this.caballerosRojos.push(caballero);
    }
  }

  crearCaballerosRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidad(CaballeroRojo, i);
      caballero.enemigos = () => this.caballerosAzules;
      this.caballerosRojos.push(caballero);
    }
  }
  crearSoldadosRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const soldado = this.crearEntidad(SoldadoRojo, i);
      soldado.enemigos = () => [
        ...this.caballerosAzules,
        ...this.soldadosAzules
      ];
      this.soldadosRojos.push(soldado);
    }
  }


  // Crea trabajadores rojos
  crearTrabajadoresRojosV1(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const trabajador = this.crearEntidad(TrabajadorRojo, i);
      this.trabajadoresRojos.push(trabajador);
    }
  }

  crearTrabajadoresRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const trabajador = this.crearEntidad(TrabajadorRojo, i);
      trabajador.enemigos = () => this.caballerosAzules; // ejemplo
      this.trabajadoresRojos.push(trabajador);
    }
  }

  // Crea una instancia de personaje genérico y lo agrega al array de entidades
  crearEntidad(ClaseEntidad, i) {
    const x = Math.random() * 500;
    const y = Math.random() * 500;
    const entidad = new ClaseEntidad(x, y, this.app, i, this);
    this.entidades.push(entidad);
    return entidad;
  }

  // Mueve la cámara si el mouse está cerca de los bordes
  moverCamara() {
    if (!this.fondo) return;

    const borde = 30;
    const { x, y } = this.mousePos;

    if (x < borde) this.containerPrincipal.x += this.velocidadCamara;
    else if (x > this.ancho - borde) this.containerPrincipal.x -= this.velocidadCamara;

    if (y < borde) this.containerPrincipal.y += this.velocidadCamara;
    else if (y > this.alto - borde) this.containerPrincipal.y -= this.velocidadCamara;

    this.limitarCamara();
  }

  // Evita que la cámara se salga del mapa
  limitarCamara() {
    const minX = -this.fondo.width + this.ancho;
    const minY = -this.fondo.height + this.alto;

    this.containerPrincipal.x = Math.min(0, Math.max(minX, this.containerPrincipal.x));
    this.containerPrincipal.y = Math.min(0, Math.max(minY, this.containerPrincipal.y));
  }
}