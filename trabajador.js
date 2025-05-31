class Trabajador extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        this.cargarSpriteAnimado()

    }


    async cargarSpriteAnimado() {

        debugger;
        let json = await PIXI.Assets.load('assets/peonNew/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.animaciones['walk_up'] = json.animations["walk_up"];
        this.animaciones['walk_down'] = json.animations["walk_down"];
        this.animaciones['walk_right_up'] = json.animations["walk_right_up"];
        this.animaciones['walk_right'] = json.animations["walk_right"];
        this.animaciones['walk_right_down'] = json.animations["walk_right_down"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); 
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = true;
        this.sprite.play();
        
         
        this.juego.containerPrincipal.addChild(this.sprite);
        

        this.sprite.x = this.x;//asigna la posicion x e y del sprite en el canvas
        this.sprite.y = this.y;

        this.listo = true;
        this.sprite.zIndex= 9999

        //this.sprite.zIndex = 10; // Asegurar que esté por encima del fondo
        //this.container.sortableChildren = true; // Habilitar ordenamiento por zIndex
    }

    cambiarAnimacion(nombre, haciaIzquierda = false) {
        if (this.animaciones[nombre]) {
            this.sprite.textures = this.animaciones[nombre];
            this.sprite.play();
    
            if (haciaIzquierda) {
                this.sprite.scale.x = -1;
                this.sprite.anchor.x = 1;
            } else {
                this.sprite.scale.x = 1;
                this.sprite.anchor.x = 0.5;
            }
        }
    }


}