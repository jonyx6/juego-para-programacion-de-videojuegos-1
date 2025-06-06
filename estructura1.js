class Gendarmeria extends ObjetosEscenario{
    constructor(x, y, juego){
        super(x, y, juego)
        this.vida = 100
        this.estadoActual = 'activa';
    };

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('assets/casasOrcas/texture.json');
        this.animaciones['idle1'] = json.animations["idle1"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle1']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 0;  
        this.sprite.y = 0;
        this.sprite.play();
        this.listo = true;
        this.sprite.zIndex=100;
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