class Personaje {
    constructor(x, y, app, i, juego) {
        this.juego = juego;
        this.i = i;
        this.app = app;
        this.x = x;
        this.y = y;
        this.vida = 5;
        
        this.velocidad = 3;
        this.listo = false;

        this.teclas = {}; // ← Nuevo: para controlar múltiples teclas a la vez
        this.animaciones = {};
        this.estadoActual = 'idle'; // estado al instanciar, va cambiando despues

        this.velocidadTexto = new PIXI.Text('', {//guarda en velocidadTexto el pixitext vacio y agrega estilos
            fontSize: 16,
            fill: '#ffffff',
        });
        this.velocidadTexto.anchor.set(0, 1); // ??
        this.app.stage.addChild(this.velocidadTexto);//agrega el texto a la pantalla

        //
        this.atacando = false;
        this.crearContainer();
    }
    crearContainer() {
        this.container = new PIXI.Container();   
        this.juego.containerPrincipal.addChild(this.container);
      }

    update(){
        this.cambiarOrdenEnZ();
        this.detenerEnBorde();
        //this.manejarDireccionDelSprite(vx);
    }

    cambiarOrdenEnZ() {
        //this.sprite.zIndex = this.y;
        this.container.zIndex = this.y + 100;
    }

    detenerEnBorde() {
        // Limitar en eje X
        if (this.x < 0) {
          this.x = 0;
          this.velX = 0;
        } else if (this.x > this.juego.ancho*2) {//tamaño del mapa!!!!!!!!!
          this.x = this.juego.ancho*2;//tamaño del mapa!!!!!!!!!
          this.velX = 0;
        }
      
        // Limitar en eje Y
        if (this.y < 0) {
          this.y = 0;
          this.velY = 0;
        } else if (this.y > this.juego.alto*2) {//tamaño del mapa!!!!!!!!!
          this.y = this.juego.alto*2;//tamaño del mapa!!!!!!!!!
          this.velY = 0;
        }
    }
    /*
    manejarDireccionDelSprite(vx) {
        if (vx > 0) {
            this.sprite.scale.x = 1;
        } else if (vx < 0) {
            this.sprite.scale.x = -1;
        }
    }  */  
   
}