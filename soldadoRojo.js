class SoldadoRojo extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.75;
    this.cargarSpriteAnimado();
    this.sonidos = [];
    this.listoSonidos = false;
    this.cargarSonidosAleatorios().then(() => {
      this.listoSonidos = true;
      console.log("Sonidos cargados correctamente");
    });
  }

    async cargarSonidosAleatorios() {
    this.sonidos = [];
    const rutas = [
      'assets/sonidoOrcoRojo/aplastarlos sin piedad.mp3',
      'assets/sonidoOrcoRojo/Furia de orco desatada.mp3',
      'assets/sonidoOrcoRojo/Grrrr... os voy a destruir.mp3',
      'assets/sonidoOrcoRojo/por la orda.mp3'
    ];

    for (const ruta of rutas) {
      const sound = new Howl({ src: [ruta] ,volume: 3 });
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
    const json = await PIXI.Assets.load('assets/textureSoldadoRojo/textureSoldadoRojo.json');

    this.animaciones = {
        abajoMov: json.animations["abajoMov"],
        arribaMov: json.animations["arribaMov"],
        deLadoMov: json.animations["ladoMov"],
        digAbajoMov: json.animations["digAbajoMov"],
        digArribaMov: json.animations["digArribaMov"],
        
        abajoAtk: json.animations["abajoAtk"],
        arribaAtk: json.animations["arribaAtk"],
        ladoAtk: json.animations["ladoAtk"],
        digAbajoAtk: json.animations["digAbajoAtk"],
        digArribaAtk: json.animations["digArribaAtk"],

        digAbajoMuerte: json.animations["digAbajoMuerte"],
        digArribaMuerte: json.animations["digArribaMuerte"],

        idleArri: json.animations["idleArri"],
        idleDiaArri: json.animations["idleDiaArri"],
        idleLado: json.animations["idleLado"],
        idleDiaAbaj: json.animations["idleDiaAbaj"],
        idleAbaj: json.animations["idleAbaj"],

    };

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idleAbaj']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.1;
    this.sprite.loop = true;
    this.sprite.play();

    this.container.addChild(this.sprite);
    this.sprite.x = this.x;
    this.sprite.y = this.y;

    this.listo = true;
  }
  obtenerAnimacionDeAtaque(dx, dy) {
    const umbral = 0.1;

    if (Math.abs(dx) < umbral && dy > 0) return 'abajoAtk';
    if (Math.abs(dx) < umbral && dy < 0) return 'arribaAtk';
    if (Math.abs(dy) < umbral && dx !== 0) return 'ladoAtk';
    if (dx !== 0 && dy > 0) return 'digAbajoAtk';
    if (dx !== 0 && dy < 0) return 'digArribaAtk';

    return 'ladoAtk';
  }

}