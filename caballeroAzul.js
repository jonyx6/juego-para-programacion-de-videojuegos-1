//------------------------------------------------------------------------------------------------------------------con mouse, 8 dir
class CaballeroAzul extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        
        this.velocidad = 3;

        this.listo = false;
        
        this.destino = null; // ← Punto al que se va a mover

        this.animaciones = {};
        
        this.estadoActual = 'idle';

        this.cargarSpriteAnimado();
        this.setupMouseControls();
        //textos
        this.velocidadTexto = new PIXI.Text('', {//guarda en velocidadTexto el pixitext vacio y agrega estilos
            fontSize: 16,
            fill: '#ffffff',
        });
        this.velocidadTexto.anchor.set(0, 1); // ??
        this.app.stage.addChild(this.velocidadTexto);//agrega el texto a la pantalla
    }

    async cargarSpriteAnimado() {
        let json = await PIXI.Assets.load('assets/knight/textureKnight.json');

        this.animaciones['abajoMov'] = json.animations["abajoMov"];
        this.animaciones['arribaMov'] = json.animations["arribaMov"];
        this.animaciones['deLadoMov'] = json.animations["deLadoMov"];
        this.animaciones['digAbajoMov'] = json.animations["digAbajoMov"];
        this.animaciones['digArribaMov'] = json.animations["digArribaMov"];

        this.animaciones['digAbajoMuerte'] = json.animations["digAbajoMuerte"];
        this.animaciones['digArribaMuerte'] = json.animations["digArribaMuerte"];

        this.animaciones['idle'] = json.animations["idle"];


        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.play();

        if (this.container) {
            this.container.addChild(this.sprite);
        } else {
            console.error("El contenedor no existe");
            this.app.stage.addChild(this.sprite); // Fallback
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.listo = true;
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

        morir2(this,this.juego.chaboncitos)


        
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
}
