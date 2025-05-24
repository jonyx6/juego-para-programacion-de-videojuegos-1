//---------------------------------------------------------------------------------------------------------------con parametros de vel y dir
/*
class CaballeroRojo extends Personaje{
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);

        this.velocidad = 3;
        
        this.listo = false;

        this.teclas = {}; // ← Nuevo: para controlar múltiples teclas a la vez
        
        this.animaciones = {};
        
        this.estadoActual = 'idle'; // estado al instanciar, va cambiando despues

        this.cargarSpriteAnimado();
        this.setupKeyboardControls();
        //textos
        this.velocidadTexto = new PIXI.Text('', {//guarda en velocidadTexto el pixitext vacio y agrega estilos
            fontSize: 16,
            fill: '#ffffff',
        });
        this.velocidadTexto.anchor.set(0, 1); // ??
        this.app.stage.addChild(this.velocidadTexto);//agrega el texto a la pantalla

        //
        this.atacando = false;
    }

    async cargarSpriteAnimado() {
        let json = await PIXI.Assets.load('assets/e_Knight/texture.json');

        // Guardar animaciones en el conjunto "animaciones"
        this.animaciones['abajoMov'] = json.animations["abajoMov"];
        this.animaciones['arribaMov'] = json.animations["arribaMov"];
        this.animaciones['ladoMov'] = json.animations["ladoMov"];
        this.animaciones['digAbajoMov'] = json.animations["digAbajoMov"];
        this.animaciones['digArribaMov'] = json.animations["digArribaMov"];

        this.animaciones['abajoAtk'] = json.animations["abajoAtk"];
        this.animaciones['arribaAtk'] = json.animations["arribaAtk"];
        this.animaciones['ladoAtk'] = json.animations["ladoAtk"];
        this.animaciones['digAbajoAtk'] = json.animations["digAbajoAtk"];
        this.animaciones['digArribaAtk'] = json.animations["digArribaAtk"];
        
        this.animaciones['idle'] = json.animations["idle"];


        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);// asigna como estado inicial a idle
        this.sprite.anchor.set(0.5, 1);//sentra el sprite
        this.sprite.animationSpeed = 0.125;//velocidad de animacion
        this.sprite.loop = true;
        this.sprite.play();//ejecutar al instanciar
        
        if (this.container) {
            this.container.addChild(this.sprite);
        } else {
            console.error("El contenedor no existe");
            this.app.stage.addChild(this.sprite); // Fallback
        }

        this.sprite.x = this.x;//asigna la posicion x e y del sprite en el canvas
        this.sprite.y = this.y;

        this.listo = true;

        //this.sprite.zIndex = 10; // Asegurar que esté por encima del fondo
        //this.container.sortableChildren = true; // Habilitar ordenamiento por zIndex
    }

    cambiarEstado(nuevoEstado) {
        if (this.estadoActual === nuevoEstado || !this.animaciones[nuevoEstado]) return;//si el estado el mismo, sale de la funcion

        this.estadoActual = nuevoEstado;
        this.sprite.textures = this.animaciones[nuevoEstado];
        this.sprite.play();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (event) => {
            this.teclas[event.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.teclas[event.key.toLowerCase()] = false;
        });
    }

    update(time) {
        super.update()
        if (!this.listo) return;//si no esta cargada la animacion, sale

        let vx = 0;
        let vy = 0;

        if (this.teclas['w']) vy -= 1;
        if (this.teclas['s']) vy += 1;
        if (this.teclas['a']) vx -= 1;
        if (this.teclas['d']) vx += 1;

        // Normalizar velocidad diagonal
        if (vx !== 0 && vy !== 0) {
            vx *= Math.SQRT1_2; // ≈ 0.707
            vy *= Math.SQRT1_2;
        }
        // asigna al x e y la nueva velocidad
        this.x += vx * this.velocidad;
        this.y += vy * this.velocidad;

        //this.cuandoLlegaAlMArgenAparecePorElOtroLado();//hace que apareca por el otro lado
        this.manejarDireccionDelSprite(vx);//voltea al personaje al cambiar de direccion

        // Cambiar animación según dirección
        if (vx === 0 && vy === 0 && !this.atacando) {
            this.cambiarEstado('idle');
        } else if (vx !== 0 && vy === 0) {
            this.cambiarEstado('ladoMov');
        } else if (vx === 0 && vy > 0) {
            this.cambiarEstado('abajoMov');
        } else if (vx === 0 && vy < 0) {
            this.cambiarEstado('arribaMov');
        } else if (vx > 0 && vy > 0 || vx < 0 && vy > 0) {
            this.cambiarEstado('digAbajoMov');
        } else if (vx > 0 && vy < 0 || vx < 0 && vy < 0) {
            this.cambiarEstado('digArribaMov');
        }
        // asigna al sprite la nueva osicion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        // Calcular la magnitud de la velocidad
        const magnitudVelocidad = Math.sqrt(vx * vx + vy * vy) * this.velocidad;

        // Calcular dirección en grados
        let direccion = Math.atan2(vy, vx); // Radianes
        let direccionGrados = direccion * (180 / Math.PI); // A grados

        // Mostrar texto
        this.velocidadTexto.text = `Velocidad: ${magnitudVelocidad.toFixed(2)}\nDirección: ${direccionGrados.toFixed(1)}°\nVida: ${this.vida}`;

        // Re-posicionar texto en esquina inferior izquierda
        this.velocidadTexto.x = 10;
        this.velocidadTexto.y = this.app.screen.height - 10;

        this.verificarColisionConChaboncitos();

    }


    manejarDireccionDelSprite(vx) {
        if (vx > 0) {
            this.sprite.scale.x = 1;
        } else if (vx < 0) {
            this.sprite.scale.x = -1;
        }
    }

    verificarColisionConChaboncitos() {
        if (this.atacando) return;
    
        for (let chaboncito of this.juego.caballerosRojos) {
            const dx = chaboncito.x - this.x;
            const dy = chaboncito.y - this.y;
            const distancia = Math.hypot(dx, dy);
    
            if (distancia < 60) {
                this.atacando = true;
    
                const angulo = Math.atan2(dy, dx) * (180 / Math.PI);
    
                if (angulo >= -30 && angulo <= 30) {
                    this.cambiarEstado('ladoAtk');
                } else if (angulo >= 150 || angulo <= -150) {
                    this.cambiarEstado('ladoAtk');
                } else if (angulo > 30 && angulo < 60) {
                    this.cambiarEstado('digAbajoAtk');
                } else if (angulo < -30 && angulo > -60) {
                    this.cambiarEstado('digArribaAtk');
                } else if (angulo >= 60 && angulo <= 120) {
                    this.cambiarEstado('abajoAtk');
                } else if (angulo <= -60 && angulo >= -120) {
                    this.cambiarEstado('arribaAtk');
                }
    
                this.sprite.loop = false;
                this.sprite.gotoAndPlay(0);
                
                // 🛠️ Aplicar daño
                //recibirDamage(chaboncito);
                hacerDamageA(chaboncito)
    
                this.sprite.onComplete = () => {
                    setTimeout(() => {
                        this.cambiarEstado('idle');
                        this.sprite.loop = true;
                        this.atacando = false;
                    }, 300); // Delay de 0.5 segundos después del ataque
                };
    
                break;
            }
        }
    }
}*/

class CaballeroRojo extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.cargarSpriteAnimado();
    this.vida = 10;
  }

  async cargarSpriteAnimado() {
    //const json = await PIXI.Assets.load('assets/knight/textureKnight.json');
    let json = await PIXI.Assets.load('assets/e_Knight/texture.json');

    this.animaciones = {
      abajoMov: json.animations["abajoMov"],
      arribaMov: json.animations["arribaMov"],
      deLadoMov: json.animations["deLadoMov"],
      digAbajoMov: json.animations["digAbajoMov"],
      digArribaMov: json.animations["digArribaMov"],
      
      abajoAtk: json.animations["abajoAtk"],
      arribaAtk: json.animations["arribaAtk"],
      ladoAtk: json.animations["ladoAtk"],
      digAbajoAtk: json.animations["digAbajoAtk"],
      digArribaAtk: json.animations["digArribaAtk"],

      digAbajoMuerte: json.animations["digAbajoMuerte"],
      digArribaMuerte: json.animations["digArribaMuerte"],
      idle: json.animations["idle"],


    };

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.1;
    this.sprite.loop = true;
    this.sprite.play();

    this.container.addChild(this.sprite);
    this.sprite.x = this.x;
    this.sprite.y = this.y;

    this.listo = true;
  }
  obtenerAnimacionDeAtaque(dx, dy) {
    const umbral = 0.1;

    if (Math.abs(dx) < umbral && dy > 0) return 'abajoAtk';
    if (Math.abs(dx) < umbral && dy < 0) return 'arribaAtk';
    if (Math.abs(dy) < umbral && dx !== 0) return 'ladoAtk';
    if (dx !== 0 && dy > 0) return 'digAbajoAtk';
    if (dx !== 0 && dy < 0) return 'digArribaAtk';

    return 'ladoAtk';
  }

}