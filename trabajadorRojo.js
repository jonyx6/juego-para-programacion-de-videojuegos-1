class TrabajadorRojo extends Personaje {
  static Estados = {
    IDLE: 'idle',
    MOVIENDO: 'caminando',
    PICANDO: 'picando',
    RECOLECTANDO: 'recolectando',
    CONSTRUYENDO: 'construyendo',
    ATACANDO: 'atacando',
    MURIENDO: 'muerto',
  };

  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.75;
    this.sonidos = [];
    this.listoSonidos = false;
    this.estadoActual = TrabajadorRojo.Estados.IDLE;
    this.animaciones = {};

    this.cargarSpriteAnimado();

    this.cargarSonidosAleatorios().then(() => {
      this.listoSonidos = true;
      console.log("Sonidos cargados correctamente");
    });

    this.destino = null;
  }

  async cargarSonidosAleatorios() {
    const rutas = [
      'assets/sonidoObrero/me vas a hacer negrear no.mp3',
      'assets/sonidoObrero/que negrero.mp3',
      'assets/sonidoObrero/que queres.mp3',
      'assets/sonidoObrero/vamo a chambear.mp3'
    ];

    for (const ruta of rutas) {
      const sound = new Howl({ src: [ruta], volume: 5 });
      this.sonidos.push(sound);
    }
  }

  emitirSonidoAleatorio() {
    if (!this.listoSonidos || this.sonidos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.sonidos.length);
    this.sonidos[randomIndex].play();
  }

  setSeleccionado(estado) {
    if (this.sprite) {
      this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
      if (estado) this.emitirSonidoAleatorio();
    }
  }

  async cargarSpriteAnimado() {
    let json = await PIXI.Assets.load('assets/peonNew/texture.json');
    let jsonDeMuerte = await PIXI.Assets.load('assets/peonmuriendo/texture.json');
    let jsonPicando = await PIXI.Assets.load('assets/peonpicando/texture.json');
    let jsonRecolectandomadera = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json');
    let jsonRecolectandoOro = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json');

    Object.assign(this.animaciones, {
      'idle': json.animations["idle"],
      'walk_up': json.animations["walk_up"],
      'walk_down': json.animations["walk_down"],
      'walk_right_up': json.animations["walk_right_up"],
      'walk_right': json.animations["walk_right"],
      'walk_right_down': json.animations["walk_right_down"],
      'muerte1': jsonDeMuerte.animations["muerte1"],
      'muerte2': jsonDeMuerte.animations["muerte2"],
      'picando_up': jsonPicando.animations["picando_up"],
      'picando_down': jsonPicando.animations["picando_down"],
      'picando_right_up': jsonPicando.animations["picando_right_up"],
      'picando_right': jsonPicando.animations["picando_right"],
      'picando_right_down': jsonPicando.animations["picando_right_down"],
      'recolectandoMadera_up': jsonRecolectandomadera.animations["recolectandoMadera_up"],
      'recolectandoMadera_down': jsonRecolectandomadera.animations["recolectandoMadera_down"],
      'recolectandoMadera_right_up': jsonRecolectandomadera.animations["recolectandoMadera_right_up"],
      'recolectandoMadera_right': jsonRecolectandomadera.animations["recolectandoMadera_right"],
      'recolectandoMadera_right_down': jsonRecolectandomadera.animations["recolectandoMadera_right_down"],
      'recolectandoOro_up': jsonRecolectandoOro.animations["recolectandoOro_up"],
      'recolectandoOro_down': jsonRecolectandoOro.animations["recolectandoOro_down"],
      'recolectandoOro_right_up': jsonRecolectandoOro.animations["recolectandoOro_right_up"],
      'recolectandoOro_right': jsonRecolectandoOro.animations["recolectandoOro_right"],
      'recolectandoOro_right_down': jsonRecolectandoOro.animations["recolectandoOro_right_down"]
    });

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.125;
    this.sprite.loop = true;
    this.sprite.play();
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.zIndex = 9999;

    this.juego.containerPrincipal.addChild(this.sprite);
    this.listo = true;
  }

  actualizar(delta) {
    switch (this.estadoActual) {
      case TrabajadorRojo.Estados.IDLE:
        this.estadoIdle();
        break;
      case TrabajadorRojo.Estados.MOVIENDO:
        this.estadoMoviendo(delta);
        break;
      case TrabajadorRojo.Estados.RECOLECTANDO:
        this.estadoRecolectando();
        break;
      case TrabajadorRojo.Estados.CONSTRUYENDO:
        this.estadoConstruyendo();
        break;
      case TrabajadorRojo.Estados.ATACANDO:
        this.estadoAtacando();
        break;
      case TrabajadorRojo.Estados.MURIENDO:
        this.estadoMuriendo();
        break;
    }
  }

  cambiarEstado(nuevoEstado) {
    if (this.estadoActual === nuevoEstado) return;
    this.estadoActual = nuevoEstado;

    switch (nuevoEstado) {
      case TrabajadorRojo.Estados.IDLE:
        this.sprite.textures = this.animaciones['idle'];
        break;
      case TrabajadorRojo.Estados.MOVIENDO:
        this.sprite.textures = this.animaciones['walk_down']; // usa walk_down como movimiento genérico
        break;
      case TrabajadorRojo.Estados.RECOLECTANDO:
        this.sprite.textures = this.animaciones['recolectandoMadera_down'];
        break;
      case TrabajadorRojo.Estados.MURIENDO:
        this.sprite.textures = this.animaciones['muerte1'];
        this.sprite.loop = false;
        break;
    }

    this.sprite.loop = true;
    this.sprite.play();
  }

  estadoIdle() {
    // opcional: lógica para IDLE
  }

  estadoMoviendo(delta) {
    if (!this.destino) {
      this.cambiarEstado(TrabajadorRojo.Estados.IDLE);
      return;
    }

    const dx = this.destino.x - this.x;
    const dy = this.destino.y - this.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < this.velocidad) {
      this.x = this.destino.x;
      this.y = this.destino.y;
      this.destino = null;
      this.cambiarEstado(TrabajadorRojo.Estados.IDLE);
    } else {
      this.x += (dx / distancia) * this.velocidad * delta;
      this.y += (dy / distancia) * this.velocidad * delta;
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  estadoRecolectando() {
    // lógica de recolección
  }

  estadoConstruyendo() {}
  estadoAtacando() {}
  estadoMuriendo() {}

  irADestino(punto) {
    this.destino = punto;
    this.cambiarEstado(TrabajadorRojo.Estados.MOVIENDO);
  }
}
