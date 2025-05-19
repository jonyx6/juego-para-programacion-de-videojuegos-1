class TrabajadorRojo extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        
        this.velocidad = 1.75;
        this.listo = false;
        this.animaciones = {};
        this.estadoActual = 'idle';
        this.cargarSpriteAnimado();

        //textos////////////////////
        this.velocidadTexto = new PIXI.Text('', {//guarda en velocidadTexto el pixitext vacio y agrega estilos
            fontSize: 16,
            fill: '#ffffff',
        });
        this.velocidadTexto.anchor.set(0, 1); // ??
        this.app.stage.addChild(this.velocidadTexto);//agrega el texto a la pantalla
        ///////////////////////////
        //18-05
        this.camino = []; // lista de puntos/celdas a seguir
        //--
    }

    async cargarSpriteAnimado() {
        debugger;
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
        
         
        this.container.addChild(this.sprite);
        

        this.sprite.x = this.x;//asigna la posicion x e y del sprite en el canvas
        this.sprite.y = this.y;

        this.listo = true;
        this.sprite.zIndex= 9999

        //this.sprite.zIndex = 10; // Asegurar que esté por encima del fondo
        //this.container.sortableChildren = true; // Habilitar ordenamiento por zIndex
    }

    cambiarEstado(nuevoEstado) {
        if (this.estadoActual === nuevoEstado || !this.animaciones[nuevoEstado]) return;

        this.estadoActual = nuevoEstado;
        this.sprite.textures = this.animaciones[nuevoEstado];
        this.sprite.play();
    }

    update(time) {
        super.update();
        if (!this.listo) return;
        
        let dx = 0;
        let dy = 0;

        if (this.camino.length > 0) {
            const objetivo = this.camino[0]; // siguiente celda objetivo

            const dx = objetivo.centerX - this.x;
            const dy = objetivo.centerY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.velocidad) {
                // Llegó a la celda objetivo
                this.x = objetivo.centerX;
                this.y = objetivo.centerY;
                this.camino.shift(); // eliminar el punto actual
            } else {
                const dirX = dx / dist;
                const dirY = dy / dist;

                this.x += dirX * this.velocidad;
                this.y += dirY * this.velocidad;
                
                this.manejarAnimacionSegunDireccion(dirX, dirY);
                this.manejarDireccionDelSprite(dirX);
            }
        }else {
            this.cambiarEstado('idle'); // ✅ cuando no hay camino
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //morir2(this,this.juego.chaboncitos)
        
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

    irA(x, y) {
        const origen = this.juego.grid.getCellAt(this.x, this.y);
        const destino = this.juego.grid.getCellAt(x, y);
        if (!origen || !destino) return;

        this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino); // nuevo método
        
    }
}
