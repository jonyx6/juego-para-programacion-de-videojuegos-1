class TrabajadorRojo extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.75; // Cada clase puede definir su propia velocidad
    this.cargarSpriteAnimado();
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