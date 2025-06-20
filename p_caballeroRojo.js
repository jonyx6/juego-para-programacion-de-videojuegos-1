class CaballeroRojo extends Enemigos {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.cargarSpriteAnimado();
    this.dirImagen = "assets/hud/jineteRojo.jpg";
    this.vida = 5;
    this.velocidad = 2;
    this.puntoDeAtaque = { x: 1500, y: 500 }; // Puede usarse en el futuro para estrategias
    
  }

  atributos(){
    return (
      "Id: " + this.iD + "          " + "Vida: " + this.vida + "\n" +
      "Def: "+ this.defensa + "       " + "Ata: " +this.ataque +"\n"+
      "Vel: " + this.velocidad + "        "+ "Estado: " + this.estado
    );
  }

  async cargarSpriteAnimado() {
    let json = await PIXI.Assets.load('assets/e_Knight/texture.json');

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
  // Desactivar control manual del mouse
  irA() {}//blanquea los metodos para que no use los del mouse
  irA_v2() {}
}
