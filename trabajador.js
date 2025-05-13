class Trabajador extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        
        this.velocidad = 1.5;

        this.listo = false;
        
        this.destino = null; // ← Punto al que se va a mover

        this.animaciones = {};
        
        this.estadoActual = 'idle';

        this.cargarSpriteAnimado();
        this.setupMouseControls();
    }

    async cargarSpriteAnimado() {

        let json = await PIXI.Assets.load('assets/peonNew/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.animaciones['arribaMov'] = json.animations["walk_up"];
        this.animaciones['abajoMov'] = json.animations["walk_down"];
        this.animaciones['digArribaMov'] = json.animations["walk_right_up"];
        this.animaciones['deLadoMov'] = json.animations["walk_right"];
        this.animaciones['digAbajoMov'] = json.animations["walk_right_down"];
        
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); 

        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = true;
        this.sprite.play();
        
        if (this.container) {
            this.container.addChild(this.sprite);
        } else {
            console.error("El contenedor no existe");
            this.app.stage.addChild(this.sprite); // Fallback
        }
        
        this.sprite.x = this.x;//asigna la posicion x e y del sprite en el canvas
        this.sprite.y = this.y;

        this.listo = true;
        //this.sprite.zIndex= 9999
        /////////////////////////////////////////////////

        //this.sprite.zIndex = 10; // Asegurar que esté por encima del fondo
        //this.container.sortableChildren = true; // Habilitar ordenamiento por zIndex
    }
    cambiarEstado(nuevoEstado) {
        if (this.estadoActual === nuevoEstado || !this.animaciones[nuevoEstado]) return;

        this.estadoActual = nuevoEstado;
        this.sprite.textures = this.animaciones[nuevoEstado];
        this.sprite.play();
    }
    setupMouseControls() {
        this.app.view.addEventListener('click', (event) => {
            const rect = this.app.view.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            this.destino = { x: mouseX, y: mouseY };
        });
    }
    update(time) {
        super.update();
        if (!this.listo) return;
        
        let dx = 0;
        let dy = 0;

        if (this.destino) {
            dx = this.destino.x - this.x;
            dy = this.destino.y - this.y;
            const distancia = Math.hypot(dx, dy);

            if (distancia > 2) {
                // Normalizar dirección
                const dirX = dx / distancia;
                const dirY = dy / distancia;

                this.x += dirX * this.velocidad;
                this.y += dirY * this.velocidad;

                this.manejarAnimacionSegunDireccion(dirX, dirY);
                this.manejarDireccionDelSprite(dirX);
            } else {
                this.destino = null;
                this.cambiarEstado('idle');
            }
        } else {
            this.cambiarEstado('idle');
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        morir2(this,this.juego.trabajador)


        
        // Mostrar texto
        this.velocidadTexto.text = `caballeroAzul\nVida: ${this.vida}`;

        // Re-posicionar texto en esquina inferior izquierda
        this.velocidadTexto.x = 200;
        this.velocidadTexto.y = this.app.screen.height - 10;
    }
    manejarDireccionDelSprite(vx) {
        if (vx > 0) {
            this.sprite.scale.x = 1;
        } else if (vx < 0) {
            this.sprite.scale.x = -1;
        }
    }
    manejarAnimacionSegunDireccion(vx, vy) {
        if (vx !== 0 && vy === 0) {
            this.cambiarEstado('deLadoMov');
        } else if (vx === 0 && vy > 0) {
            this.cambiarEstado('abajoMov');
        } else if (vx === 0 && vy < 0) {
            this.cambiarEstado('arribaMov');
        } else if (vx !== 0 && vy > 0) {
            this.cambiarEstado('digAbajoMov');
        } else if (vx !== 0 && vy < 0) {
            this.cambiarEstado('digArribaMov');
        }
    }

    seleccionar() {
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
    /*
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
    
    
    
    
    
    
    
/*
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
    }*/


}