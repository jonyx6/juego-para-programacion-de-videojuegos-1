class GendarmeriaHumana extends ObjetosEscenario{
    constructor(x, y, juego){
        super(x, y, juego)
        this.vida = 100
        this.estadoActual = 'activa';
        
    };

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('assets/casaHumana/texture.json');
        this.animaciones['casaHumana'] = json.animations["casaHumana"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['casaHumana']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 0;  
        this.sprite.y = 0;
        this.sprite.play();
        this.sprite.zIndex=100;
        this.listo = true;
        this.container.addChild(this.sprite)
        this.ancho = this.sprite.width;
        this.alto = this.sprite.height;
    }

    atributos(){
        return (
        "Estado: "  + this.estadoActual + "\n" +
        "Vida : "   + this.vida + "\n"
        );
    }

    

}