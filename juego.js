class Juego {
  constructor() {
    // Dimensiones del canvas
    this.ancho =1920;
    this.alto =1080;

    // App principal de PIXI
    this.app = new PIXI.Application({
      width :this.ancho,
      height : this.alto
    });

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
    this.trabajadoresAzules = [];

    this.entidadesEnemigas = [];
    this.caballerosRojos = [];        // Solo los caballeros rojos
    this.trabajadoresRojos = [];      // Solo los trabajadores
    this.soldadosRojos = []; 

    this.objetosDeEscenario =[];
    this.objetosDeEscenarioAzules =[];//10/06/2025------------
    this.objetosDeEscenarioRojos =[];//19/06/2025----------
    this.enemigos = [];
    this.iniciarMusica();
   

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
  async inicializarJuego() {
    document.body.appendChild(this.app.canvas);
    window.__PIXI_APP__ = this.app;

    this.crearContainerPrincipal();
    //await this.ponerFondoJonyViejo(); 
    await this.ponerFondo1(); // fondo alto
    //await this.ponerFondo2(); //fondo ancho
    //this.ponerFondo3();
    this.instanciarComponentes();
    this.crearUi();

    //paredes de grid
    this.generadorParedes = new GeneradorParedesAleatorias(this.grid);//v3 que no funciona
    this.generadorParedes.generarParedesAleatorias(0.02);

    //this.crearEntidades();
    await this.crearEntidades();
    this.crearEstructura(GendarmeriaHumana, 5, 5);//Columna / fila
    this.crearEstructura(CentralAzul, 5, 15);
    this.crearEstructura(GendarmeriaHumana, 5, 25);
    this.crearEstructura(MinaDeOro, 10, 15);//10/06/2025

    this.crearEstructuraEnemiga(Gendarmeria, 50, 5);
    this.crearEstructuraEnemiga(CentralRoja, 50, 15);
    this.crearEstructuraEnemiga(Gendarmeria, 50, 25);

    this.app.ticker.add(() => this.gameLoop());

    this.app.view.addEventListener('contextmenu', (e) => e.preventDefault());
    this.debugGraphics = new PIXI.Graphics();
    this.debugGraphics.zIndex = 10;
    this.containerPrincipal.addChild(this.debugGraphics);
  }

  crearUi(){
    this.ui= new UI(this)
  }

  iniciarMusica() {
    this.musicaFondo = new Howl({
      src: ['Elwynn Forest - Music & Ambience - World of Warcraft.mp3'], 
      loop: true,
      volume: 0.5,
      html5: true 
    });
    this.musicaFondo.play();
  }
  
  // Crea el contenedor principal donde se agregan todos los elementos del juego
  crearContainerPrincipal() {
    this.containerPrincipal = new PIXI.Container();
    this.containerPrincipal.name = "containerPrincipal";
    this.containerPrincipal.sortableChildren = true; // Permite ordenar por zIndex
    this.containerPrincipal.sortableChildren = true;
    this.app.stage.addChild(this.containerPrincipal);
  }

  // Instancia los módulos necesarios para el juego (grilla, mouse, campo vectorial)
  instanciarComponentes() {
    this.cursor =  new MouseManager(this,this.app, this.containerPrincipal)//08/06/2025
  }

  // Carga y agrega el fondo del mapa
  async ponerFondoJonyViejo() {
    const textura = await PIXI.Assets.load("assets/mapas/bg.png");
    this.fondo = new PIXI.Sprite(textura);
    this.fondo.width = this.ancho;
    this.fondo.height = this.alto;
    this.fondo.zIndex = -1;
    this.app.stage.addChild(this.fondo);
  }

  async ponerFondo1() {
    const textura = await PIXI.Assets.load("assets/mapas/map_1980-2160.png");
    this.fondo = new PIXI.Sprite(textura);
    this.fondo.width = 1920;
    this.fondo.height = 2160;
    this.fondo.zIndex = -1;
    this.containerPrincipal.addChild(this.fondo);

    this.limiteAncho = this.fondo.width;
    this.limiteAlto = this.fondo.height;

    // ✅ Crear el grid según tamaño del fondo
    const tamCelda = 32;
    const cols = Math.ceil(this.fondo.width / tamCelda);
    const rows = Math.ceil(this.fondo.height / tamCelda);

    this.grid = new Grid(this, cols, rows, tamCelda);
  }

  async ponerFondo2() {
    const textura = await PIXI.Assets.load("assets/mapas/map_3840-1084.png");
    this.fondo = new PIXI.Sprite(textura);
    this.fondo.width = 3840;
    this.fondo.height = 1084;
    this.fondo.zIndex = -1;
    this.containerPrincipal.addChild(this.fondo);

    this.limiteAncho = this.fondo.width;
    this.limiteAlto = this.fondo.height;

    // ✅ Crear el grid según tamaño del fondo
    const tamCelda = 32;
    const cols = Math.ceil(this.fondo.width / tamCelda);
    const rows = Math.ceil(this.fondo.height / tamCelda);

    this.grid = new Grid(this, cols, rows, tamCelda);
  }

  // Crea los personajes iniciales del juego
  async crearEntidades() {
    //--- personajes ---
    //-AZULES
    this.crearTrabajadoresAzules(5)
    this.crearSoldadosAzules(10)
    this.crearCaballerosAzules(10);

    //-ROJOS
    this.crearTrabajadoresRojos(5);
    this.crearSoldadosRojos(10)
    this.crearCaballerosRojos(10);
    
    //-OBJETOS-
    await Arbol.cargarEnCeldasBloqueadas(this);
    this.app.stage.sortableChildren = true;
    this.containerPrincipal.sortableChildren = true;
  }

  // Ciclo principal del juego (se ejecuta en cada frame)
  gameLoop(time) {
    this.containerPrincipal.children.sort((a, b) => a.y - b.y);
    this.caballerosAzules.forEach(p => p.cambiarOrdenEnZ());
    this.caballerosRojos.forEach(p => p.cambiarOrdenEnZ());
    
    this.objetosDeEscenario.forEach(o => o.cambiarOrdenEnZ());
    
    this.time = time;
    this.contadorDeFrame++;

    this.debugGraphics.clear();
    this.grid.render(this.debugGraphics);

    // Actualizar todas las entidades (personajes)
    for (const entidad of this.entidades) {
      entidad.update(time);
      entidad.render();
    }
    this.cursor.eventosDelHud()
    
    // Mover la cámara si el mouse está en los bordes
    this.moverCamara();
  }

  // === Métodos para crear PERSONAJES ===----------------------------------------------------------------------------------------------

  // Crea caballeros azules
  async crearCaballerosAzules(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidad(CaballeroAzul, i);
      caballero.enemigos = () => this.obtenerEnemigosRojos();
      await caballero.cargarSonidosAleatorios()
      this.caballerosAzules.push(caballero);
    }
  }
  async crearSoldadosAzules(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      //const soldado = new SoldadoAzul(Math.random() * 500, Math.random() * 500, this.app, i, this);
      const soldado = this.crearEntidad(SoldadoAzul, i);
      soldado.enemigos = () => this.obtenerEnemigosRojos();
      await soldado.cargarSonidosAleatorios()
      this.caballerosAzules.push(soldado);
    }
  }
   async crearTrabajadoresAzules(cantidad) {
      for (let i = 0; i < cantidad; i++) {
        //const trabajador = new TrabajadorRojo(100, 100, this.app, i,this)
        const trabajador = this.crearEntidad(TrabajadorAzul, i);
        trabajador.enemigos = () => this.obtenerEnemigosRojos();
    //      [
    //    ...this.caballerosRojos,
    //    ...this.soldadosRojos,
    //    ...this.trabajadoresRojos,
    //    ...this.objetosDeEscenarioRojos
    //  ];
        await trabajador.cargarSonidosAleatorios(); // Esperar a que cargue sonidos
        this.trabajadoresAzules.push(trabajador);
      }
  } 
  // Crea caballeros rojos
  async crearCaballerosRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const caballero = this.crearEntidadRoja(CaballeroRojo, i);
      caballero.enemigos = () => this.obtenerEnemigosAzules();
      await caballero.cargarSonidosAleatorios()
      this.caballerosRojos.push(caballero);
      this.entidadesEnemigas.push(caballero);
    }
  }
  async crearSoldadosRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const soldado = this.crearEntidadRoja(SoldadoRojo, i);
      soldado.enemigos = () => this.obtenerEnemigosAzules();
      await soldado.cargarSonidosAleatorios()
      this.soldadosRojos.push(soldado);
      this.entidadesEnemigas.push(soldado);
    }
  }
  // Crea trabajadores rojos
 async crearTrabajadoresRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      //const trabajador = new TrabajadorRojo(100, 100, this.app, i,this)
      const trabajador = this.crearEntidadRoja(TrabajadorRojo2, i);
      trabajador.enemigos = () => this.obtenerEnemigosAzules(); 
      await trabajador.cargarSonidosAleatorios(); // Esperar a que cargue sonidos
      this.trabajadoresRojos.push(trabajador);
      this.entidadesEnemigas.push(trabajador);
    }
  }
  // Crea una instancia de personaje genérico y lo agrega al array de entidades
  crearEntidad(ClaseEntidad, i) {
    const x = Math.random() * 600;
    const y = Math.random() * 1000;
    const entidad = new ClaseEntidad(x, y, this.app, i, this);
   
    this.entidades.push(entidad);
    return entidad;
  }

  crearEntidadRoja(ClaseEntidad, i) {
  // Generar posiciones en el lado derecho de la pantalla
    const x = Math.random() * 600 + (this.limiteAncho - 600); // Lado derecho
    const y = Math.random() * 1000;
    const entidad = new ClaseEntidad(x, y, this.app, i, this);
  
    this.entidades.push(entidad);
    return entidad;
  }

  crearTrabajadorCercaDe(estructura) {//07/07/2025

    console.log("Propiedades de la estructura:", Object.keys(estructura));
    console.log("Estructura completa:", estructura);    

    const x = (estructura.container?.x || estructura.x || 400);     
    const y = (estructura.container?.y || estructura.y || 300);  
    
    console.log(`Creando caballero en: x=${x}, y=${y}`); // 👈 Agregar esto
    console.log(`Estructura en: x=${estructura.centerX}, y=${estructura.centerY}`); // 👈 Y esto

    const i = Date.now(); // ID único
    //const trabajador = new TrabajadorRojo2(x, y, this.app, i, this);
    const trabajador = new CaballeroRojo(x, y, this.app, i, this);
    // 👇 Asignar enemigos como en crearTrabajadoresRojos()
    trabajador.enemigos = () => [
      ...this.caballerosAzules,
      ...this.soldadosAzules,
      ...this.objetosDeEscenarioAzules
    ];

    this.entidades.push(trabajador);
    this.caballerosRojos.push(trabajador);

    console.log("👷 Caballero creado cerca de la central");
  }
  crearCaballeroAzulCercaDe(estructura) {//07/07/2025

    console.log("Propiedades de la estructura:", Object.keys(estructura));
    console.log("Estructura completa:", estructura);    

    const x = (estructura.container?.x || estructura.x || 400);     
    const y = (estructura.container?.y || estructura.y || 300);  
    
    console.log(`Creando caballero en: x=${x}, y=${y}`); // 👈 Agregar esto
    console.log(`Estructura en: x=${estructura.centerX}, y=${estructura.centerY}`); // 👈 Y esto

    const i = Date.now(); // ID único
    //const trabajador = new TrabajadorRojo2(x, y, this.app, i, this);
    const trabajador = new CaballeroAzul(x, y, this.app, i, this);
    // 👇 Asignar enemigos como en crearTrabajadoresRojos()
    trabajador.enemigos = () => this.obtenerEnemigosRojos();

    this.entidades.push(trabajador);
    this.caballerosAzules.push(trabajador);

    console.log("👷 Caballero creado cerca de la central");
  }
  obtenerCeldaVecinaMasCercana(objeto) {
    const celdas = objeto.obtenerCeldasVecinasLibres();
    let mejorCelda = null;
    let menorDist = Infinity;

    for (const celda of celdas) {
      const dx = celda.centerX - this.x;
      const dy = celda.centerY - this.y;
      const dist = dx * dx + dy * dy;

      if (dist < menorDist) {
        menorDist = dist;
        mejorCelda = celda;
      }
    }

    return mejorCelda;
  }

  // === Métodos De CAMARA ===-------------------------------------------------------------------------------------------------------
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
    const escala = this.containerPrincipal.scale.x;
    const minX = -this.fondo.width * escala + this.ancho;
    const minY = -this.fondo.height * escala + this.alto;

    this.containerPrincipal.x = Math.min(0, Math.max(minX, this.containerPrincipal.x));
    this.containerPrincipal.y = Math.min(0, Math.max(minY, this.containerPrincipal.y));
  }

// === Métodos para crear ESTRUCTURAS ===----------------------------------------------------------------------------------------------
  async crearEstructura(EstructuraClase, col, row) {
    const estructura = new EstructuraClase(this, col, row);
    await estructura.inicializar();
    this.objetosDeEscenario.push(estructura);
    this.objetosDeEscenarioAzules.push(estructura);
  }
  async crearEstructuraEnemiga(EstructuraClase, col, row) {
    const estructura = new EstructuraClase(this, col, row);
    await estructura.inicializar();
    this.objetosDeEscenario.push(estructura);
    this.objetosDeEscenarioRojos.push(estructura);
  }
  obtenerEnemigosRojos() {//07/07/2025
    return [
      ...this.caballerosRojos,
      ...this.soldadosRojos,
      ...this.trabajadoresRojos,
      ...this.objetosDeEscenarioRojos
    ];
  }

  obtenerEnemigosAzules() {
    return [
      ...this.caballerosAzules,
      ...this.soldadosAzules,
      ...this.trabajadoresAzules,
      ...this.objetosDeEscenarioAzules
    ];
  }
}