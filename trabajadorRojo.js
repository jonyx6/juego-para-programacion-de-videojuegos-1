class TrabajadorRojo extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.75; // velocidad propia

    this.sonidos = [];

    this.listoSonidos = false;  // flag para saber si cargó sonidos

    this.cargarSpriteAnimado();

    // Llamamos async pero no podemos esperar aquí, así que mejor hacerlo fuera
    this.cargarSonidosAleatorios().then(() => {
      this.listoSonidos = true;
      console.log("Sonidos cargados correctamente");
    });
  }

  async cargarSonidosAleatorios() {
    this.sonidos = [];
    const rutas = [
      'assets/sonidoObrero/me vas a hacer negrear no.mp3',
      'assets/sonidoObrero/que negrero.mp3',
      'assets/sonidoObrero/que queres.mp3',
      'assets/sonidoObrero/vamo a chambear.mp3'
    ];

    for (const ruta of rutas) {
      const sound = new Howl({ src: [ruta] ,volume: 5 });
      this.sonidos.push(sound);
    }
  }

  emitirSonidoAleatorio() {
    if (!this.listoSonidos) {
      console.warn("Sonidos no están listos aún");
      return;
    }
    if (!this.sonidos || this.sonidos.length === 0) {
      console.warn("No hay sonidos cargados");
      return;
    }
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
    const json = await PIXI.Assets.load('assets/peonNew/texture.json');

    this.animaciones = {
      idle: json.animations["idle"],
      arribaMov: json.animations["walk_up"],
      abajoMov: json.animations["walk_down"],
      deLadoMov: json.animations["walk_right"],
      digArribaMov: json.animations["walk_right_up"],
      digAbajoMov: json.animations["walk_right_down"],
    };

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.125;
    this.sprite.loop = true;
    this.sprite.play();

    this.container.addChild(this.sprite);
    this.sprite.x = this.x;
    this.sprite.y = this.y;

    this.listo = true;
  }
}

