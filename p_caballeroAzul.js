class CaballeroAzul extends Aliados {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.cargarSpriteAnimado();
    this.dirImagen = "assets/hud/caballeroazul.jpg";
    this.vida = 10;
    this.velocidad = 2;
    this.defensa = 6;
    this.ataque = 17;
  }

  atributos(){
    return (
      "Id: " + this.iD + "          " + "Vida: " + this.vida + "\n" +
      "Def: "+ this.defensa + "       " + "Ata: " +this.ataque +"\n"+
      "Vel: " + this.velocidad + "        "+ "Estado: " + this.estado
    );
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
}