class Personaje {
    constructor(x, y, app, i, juego) {
        this.juego = juego;
        this.i = i;
        this.app = app;
        this.x = x;
        this.y = y;
        this.vida = 5;

        //18-05
        //FUERA 19/05
        //this.vx = 0;
        //this.vy = 0;
        this.vectorFieldInfluence = 1.0;
        this.cell = null;
        //--
        
        this.velocidad = 5;
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

        //18/05
        //this.x += this.vx;
        //this.y += this.vy;

        // Fricción
        //this.vx *= 0.9;
        //this.vy *= 0.9;
        //--
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
   //18-05
    //aplicarFuerza(x, y) {
    //  this.vx += x;
    //  this.vy += y;
    //}
    //
    //19/05
    setSeleccionado(seleccionado) {
        if (this.sprite) {
            this.sprite.tint = seleccionado ? 0xff0000 : 0xFFFFFF;
        }
    }
}