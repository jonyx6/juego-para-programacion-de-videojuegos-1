class Trabajador extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        this.crearContainer()
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
        
         
        this.container.addChild(this.sprite);
        

        this.sprite.x = this.x;//asigna la posicion x e y del sprite en el canvas
        this.sprite.y = this.y;

        this.listo = true;
        this.sprite.zIndex= 9999

        //this.sprite.zIndex = 10; // Asegurar que esté por encima del fondo
        //this.container.sortableChildren = true; // Habilitar ordenamiento por zIndex
    }

   /* seleccionar() {
        // Podés mostrar un borde, sombra, o simplemente marcarlo como seleccionado
        console.log("Personaje seleccionado");
        this.sprite.tint = 0x00ff00; // Lo tiñe de verde al seleccionarlo
    }
    
    deseleccionar() {
    this.sprite.tint = 0xFFFFFF; // Color original (sin tinte)
    }
    
    moverA(destX, destY) {
        // Movimiento directo hacia la posición (se puede mejorar con interpolación después)
        this.setPositionx(destX);
        this.y = destY;
        this.sprite.y = destY;
    }
            update() {


        if (this.destinoX !== null && this.destinoY !== null) {
             const dx = this.destinoX - this.x;
             const dy = this.destinoY - this.y;
             const distancia = Math.sqrt(dx * dx + dy * dy);
            
        if (distancia > 1) {
            const dirX = dx / distancia;
            const dirY = dy / distancia;
            this.x += dirX * this.velocidad;
            this.y += dirY * this.velocidad;
            if (this.sprite) {
                this.sprite.x = this.x;
                this.sprite.y = this.y;
            }
            } else {
                        // Llegó al destino
                        this.x = this.destinoX;
                        this.y = this.destinoY;
                        this.destinoX = null;
                        this.destinoY = null;
                    }
            }
            
                // Podés mantener o comentar el control por teclado si querés:
                /*
                if(this.teclas["d"]){ this.moverALaDerecha(this.velocidad); }
                else if(this.teclas["s"]){ this.moverAbajo(this.velocidad); }
                else if(this.teclas["w"]){ this.moverArriba(this.velocidad); }
                else if(this.teclas["a"]){ this.moverALaIzquieda(this.velocidad); }
                
            
            
    }*/
    
    
    
    
    
    
    

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