class Juego {
  constructor() {
    // Dimensiones del canvas
    this.ancho = 1920;
    this.alto = 1080;

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
    this.caballerosRojos = [];        // Solo los caballeros rojos
    this.trabajadoresRojos = [];      // Solo los trabajadores
    this.soldadosRojos = []; 
    this.objetosDeEscenario =[];
    this.enemigos = [];


    // Datos de selección con mouse
    this.selectedEntities = [];
    this.selectionBox = null;
    this.isSelecting = false;

    // Iniciar escucha de movimiento del mouse
    this.escucharMovimientoMouse();
    this.iniciarMusica();
    

    // Iniciar la app de PIXI y luego cargar el juego
    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.inicializarJuego();
      this.iniciarMusica();
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
    
    
    this.crearUi();
    
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

  crearUi(){
    this.ui= new UI(this)
  }

  iniciarMusica(){
    const musicaFondo = new Howl({
    src: ['Elwynn Forest - Music & Ambience - World of Warcraft.mp3'],
    loop: true,
    volume: 0.5 // de 0.0 a 1.0
    });
    musicaFondo.play();
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
    this.grid = new Grid(this,32);
    this.cursor =  new MouseManager(this,this.app)
  }

  // Carga y agrega el fondo del mapa
  async ponerFondo() {
    const textura = await PIXI.Assets.load("bg.png");
    this.fondo = new PIXI.Sprite(textura);
    this.fondo.width = this.ancho;
    this.fondo.height = this.alto;
    this.fondo.zIndex = -1;
    this.app.stage.addChild(this.fondo);
  }

  // Crea los personajes iniciales del juego
  crearEntidades() {
    
    this.crearMinaDeOro(1 , 400, 200);
    this.crearMinaDeOro(1 , 1600, 700);
    this.casaHumana(1 , 1500,700)
    this.cargarCasaOrca(1)
    this.crearSoldadosAzules(6)
    this.crearSoldadosRojos(6)
    this.crearTrabajadoresRojos(1);
    this.crearCaballerosAzules(1);
    this.cargarArbolesEnCeldasBloqueadas();
    this.app.stage.sortableChildren = true;
    this.containerPrincipal.sortableChildren = true;
    
  }

  // Ciclo principal del juego (se ejecuta en cada frame)
  gameLoop(time) {
    this.containerPrincipal.children.sort((a, b) => a.y - b.y);
    this.caballerosAzules.forEach(p => p.cambiarOrdenEnZ());
    this.caballerosRojos.forEach(p => p.cambiarOrdenEnZ());
    this.caballerosRojos.forEach(p => p.cargarSonidosAleatorios());
    this.objetosDeEscenario.forEach(o => o.cambiarOrdenEnZ());
    this.time = time;
    this.contadorDeFrame++;

    // Actualizar todas las entidades (personajes)
    for (const entidad of this.entidades) {
      entidad.update(time);
      entidad.render();

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
      const soldado = new SoldadoAzul(Math.random() * 500, Math.random() * 500, this.app, i, this);
      soldado.enemigos = () => [
        ...this.caballerosRojos,
        ...this.soldadosRojos,
        ...this.trabajadoresRojos
      ];
      this.entidades.push(soldado);
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

  //crea arboles con posiciones al azar
  
  async cargarArbolesEnCeldasBloqueadas() {
    const promesas = [];

    for (const celda of this.grid.cells) {
      if (
        celda.blocked &&               // La celda está bloqueada
        celda.y < 700 &&              // No queremos árboles con Y >= 700
        celda.entities.length ==0  // No hay ya una entidad ocupando la celda
      ) {
        const arbol = new Arbol(celda.centerX, celda.y + celda.height, this);

        promesas.push(
          arbol.cargarSpritesAnimados().then(() => {
            celda.addEntity(arbol);                     // Registrar en la celda
            this.containerPrincipal.addChild(arbol.container); // Agregar al escenario
            this.objetosDeEscenario.push(arbol);        // Registrar en la lista general
          })
        );
      }
    }

    await Promise.all(promesas);
  }

  

    
  


  async crearMinaDeOro(cantidad,unX,unY){

    if (!this.grid) {
      console.error("Grid no inicializada al llamar a cargarCasaOrca");
      return;
    }

    const promesas = [];

    for (let i = 0; i < cantidad; i++) {
      const casa = new MinaDeOro(0, 0, this); // coordenadas temporales

      promesas.push(
        casa.cargarSpritesAnimados().then(() => {
          // ASIGNAR posición diferente para cada casa, ejemplo en grilla simple:
          const separacion = 100; // separación entre casas
          casa.container.x = unX + i * 100 * separacion;
          casa.container.y = unY ; // fijo en Y o podes variar también

          this.containerPrincipal.addChild(casa.container);
          this.objetosDeEscenario.push(casa);

          // Ajustar posición tomando en cuenta anclaje (0.5, 1)
          const xAjustado = casa.container.x - casa.ancho / 2;
          const yAjustado = casa.container.y - casa.alto;

          const celdas = this.grid.getCeldasOcupadasPorSprite(
            xAjustado,
            yAjustado,
            casa.ancho,
            casa.alto
          );

          for (const celda of celdas) {
            celda.blocked = true;
            this.grid.bloquearCelda(celda.col, celda.row);
            celda.addEntity(casa)
          }
        })
      );
    }

    await Promise.all(promesas);
  };



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
  async crearTrabajadoresRojosV1(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const trabajador = this.crearEntidad(TrabajadorRojo, i);
      await trabajador.cargarSonidosAleatorios(); // Esperar a que cargue sonidos
      this.trabajadoresRojos.push(trabajador);
    }
  }

 async crearTrabajadoresRojos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const trabajador = new TrabajadorRojo(100, 100, this.app, i,this)
      trabajador.enemigos = () => this.caballerosAzules; // ejemplo
      await trabajador.cargarSonidosAleatorios(); // Esperar a que cargue sonidos
      this.entidades.push(trabajador);
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


  async cargarCasaOrca(cantidad) {
    if (!this.grid) {
      console.error("Grid no inicializada al llamar a cargarCasaOrca");
      return;
    }

    const promesas = [];

    for (let i = 0; i < cantidad; i++) {
      const casa = new Gendarmeria(0, 0, this); // coordenadas temporales

      promesas.push(
        casa.cargarSpritesAnimados().then(() => {
          // ASIGNAR posición diferente para cada casa, ejemplo en grilla simple:
          const separacion = 100; // separación entre casas
          casa.container.x = 200 + i * separacion;
          casa.container.y = 200; // fijo en Y o podes variar también

          this.containerPrincipal.addChild(casa.container);
          this.objetosDeEscenario.push(casa);
          

          // Ajustar posición tomando en cuenta anclaje (0.5, 1)
          const xAjustado = casa.container.x - casa.ancho / 2;
          const yAjustado = casa.container.y - casa.alto;

          const celdas = this.grid.getCeldasOcupadasPorSprite(
            xAjustado,
            yAjustado,
            casa.ancho,
            casa.alto
          );

          for (const celda of celdas) {
            celda.blocked = true;
            this.grid.bloquearCelda(celda.col, celda.row);
            celda.addEntity(casa)
          }
        })
      );
    }

    await Promise.all(promesas);
  }


  async casaHumana(cantidad) {
    if (!this.grid) {
      console.error("Grid no inicializada al llamar a cargarCasaOrca");
      return;
    }

    const promesas = [];

    for (let i = 0; i < cantidad; i++) {
      const casa = new GendarmeriaHumana(0, 0, this); // coordenadas temporales

      promesas.push(
        casa.cargarSpritesAnimados().then(() => {
          // ASIGNAR posición diferente para cada casa, ejemplo en grilla simple:
          const separacion = 100; // separación entre casas
          casa.container.x = 1800 + i * separacion;
          casa.container.y = 700; // fijo en Y o podes variar también

          this.containerPrincipal.addChild(casa.container);
          this.objetosDeEscenario.push(casa);

          // Ajustar posición tomando en cuenta anclaje (0.5, 1)
          const xAjustado = casa.container.x - casa.ancho / 2;
          const yAjustado = casa.container.y - casa.alto;

          const celdas = this.grid.getCeldasOcupadasPorSprite(
            xAjustado,
            yAjustado,
            casa.ancho,
            casa.alto
          );

          for (const celda of celdas) {
            celda.blocked = true;
            this.grid.bloquearCelda(celda.col, celda.row);
            celda.addEntity(casa)
          }
        })
      );
    }

    await Promise.all(promesas);

  }

}