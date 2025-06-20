class MinaDeOro extends ObjetosEscenario {
  constructor(juego, col, row) {
    super(juego, col, row);
    this.vida = 20;//11/06/2025--
    this.estadoActual = 'activa';
    this.cantOro = 12.500 ;
    this.dirImagen ="assets/hud/mina.jpg"
    this.dirImagen2 = "assets/minaDeOro/0.png"; // Asegurate que exista
  }

  async cargarSprite() {
    const textura = await PIXI.Assets.load(this.dirImagen2);

    this.sprite = new PIXI.Sprite(textura);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.zIndex = 100;

    this.ancho = this.sprite.width;
    this.alto = this.sprite.height;

    this.container.addChild(this.sprite);
    this.listo = true;
  }

  atributos() {
    return (
      "Estado: " + this.estadoActual + "\n" +
      "Vida : " + this.vida + "\n"
    );
  }

    setSeleccionado(estado) {
    if (this.sprite) {
      this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
      if (estado) this.emitirSonidoAleatorio();
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*constructor(x,y,juego){
        super(x,y,juego)
        this.cantOro = 12.500 ;
        this.dirImagen ="assets/hud/mina.jpg"
        this.estadoActual = 'activa';
    }

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('assets/minaDeOro/texture.json');
        this.animaciones['minaVacia'] = json.animations["minaVacia"];
        this.animaciones['minaOcupada'] = json.animations["minaOcupada"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['minaVacia']); //cargo la animacion
        this.sprite.anchor.set(0.8, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 40;  
        this.sprite.y = 0;
        this.sprite.play();
        this.listo = true;
        this.container.addChild(this.sprite)
        this.ancho = this.sprite.width;
        this.alto = this.sprite.height;
    }
  */
}