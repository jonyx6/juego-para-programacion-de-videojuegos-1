class Piedra extends ObjetosEscenario{
  constructor(juego, col, row) {
    super(juego, col, row);
    this.cantMadera=500;
    this.dirImagen ="assets/piedra/rocaRecurso.png"

    this.vida = 20;//11/06/2025--
    this.estadoActual = 'activa';

      // Array con los 3 sprites diferentes de piedra
    const spritesPiedra = [
        "assets/piedra/rocaRecurso.png",
        "assets/piedra/rocaRecursoB.png",
        "assets/piedra/rocaRecursoC.png"
    ];
    
    // Elegir uno aleatoriamente
    this.dirImagen2 = spritesPiedra[Math.floor(Math.random() * spritesPiedra.length)];
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
 
}