class SoldadoAzul extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.75;
    this.sonidos = [];
    this.listoSonidos = false;
    this.dirImagen ="assets/hud/soldadoAzul2.jpg"
    this.cargarSpriteAnimado();
    this.cargarSonidosAleatorios().then(() => {
      this.listoSonidos = true;
      console.log("Sonidos cargados correctamente");
    });
  }

  atributos(){
    return (
      "ID: " + this.iD + "\n" +
      "VIDA: " + this.vida + "\n" +
      "Vel: " + this.velocidad + "\n"+
      "Estado: " + this.estadoActual
    );
  }

  async cargarSonidosAleatorios() {
    this.sonidos = [];
    const rutas = [
      'assets/sonidoSoldadosAzules/a sus ordenes capitan.mp3',
      'assets/sonidoSoldadosAzules/ahhhh.mp3',
      'assets/sonidoSoldadosAzules/allá la.mp3',
      'assets/sonidoSoldadosAzules/viva la libertad carajo.mp3'
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
    const json = await PIXI.Assets.load('assets/texturaSoldadoAzul/textureSoldadoAzul.json');

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