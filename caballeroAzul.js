class CaballeroAzul extends Personaje{
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.cargarSpriteAnimado();
    this.velocidad = 3;
  }

  async cargarSpriteAnimado() {
    const json = await PIXI.Assets.load('assets/knight/textureKnight.json');

    this.animaciones = {
      abajoMov: json.animations["abajoMov"],
      arribaMov: json.animations["arribaMov"],
      deLadoMov: json.animations["deLadoMov"],
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