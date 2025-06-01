class Arbol extends ObjetosEscenario{
    constructor(x, y, juego){
        super(x, y, juego)
    };

    async cargarSpritesAnimados() {
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

    updateZIndex() {
        this.container.zIndex = this.container.y;
    }

    

}