class MinaDeOro extends ObjetosEscenario {
    constructor(x,y,juego){
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
    
    atributos(){
        return (
        "Estado: " + this.estadoActual + "\n" +
        "cantOro: " + this.cantOro + "\n" 
        );
    }

    setSeleccionado(estado) {
    if (this.sprite) {
      this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
      if (estado) this.emitirSonidoAleatorio();
    }
  }
}