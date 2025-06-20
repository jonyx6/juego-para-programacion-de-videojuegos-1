class Arbol extends ObjetosEscenario{
  constructor(juego, col, row) {
    super(juego, col, row);
    this.cantMadera=500;
    this.dirImagen ="assets/hud/arbol.jpg"

    this.vida = 20;//11/06/2025--
    this.estadoActual = 'activa';
    this.dirImagen2 = "assets/arbol/00.png"; // Asegurate que exista
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

  atributos(){
        return (
        "cantMadera: " + this.cantMadera 
        );
  }  

  updateZIndex() {

        this.container.zIndex = this.container.y;
  }

  setSeleccionado(estado) {
    if (this.sprite) {
      this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
      if (estado) this.emitirSonidoAleatorio();
    }
  }

  static async cargarEnCeldasBloqueadas(juego) {
    const promesas = [];

    for (const celda of juego.grid.cells) {
        if (
        celda.blocked &&               
        celda.entities.length == 0  
        ) {
        // Elegir aleatoriamente entre Arbol y Piedra
        const ClaseObjeto = Math.random() < 0.5 ? Arbol : Piedra;
        const objeto = new ClaseObjeto(juego, celda.col, celda.row);

        promesas.push(
            objeto.inicializar().then(() => {
            juego.objetosDeEscenario.push(objeto);
            })
        );
        }
    }

    await Promise.all(promesas);
  } 
  
  /*async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('assets/arbol/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 0;  
        this.sprite.y = 0;
        this.sprite.play();
        this.listo = true;
        this.container.addChild(this.sprite)
    }
  */
}