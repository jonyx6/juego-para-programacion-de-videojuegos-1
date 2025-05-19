class Juego {
///////////////////////////////////////////////////////////////////////////////////////////////////////--Constructor
    constructor() {
        //construye la pantalla de juego
        //this. = Juego.
        this.chaboncitos = []; //crea un array para guardar las instancias
        this.deathKnights = [];
        
        this.entidades = []; // array principal
        this.caballerosRojos = [];
        this.caballerosAzules = [];
        this.trabajador = [];

        this.personajes = []; // Para que el puntero los pueda ver

        this.app = new PIXI.Application(); //reemplaza la palabra PIXI.Application()
        //define el canvas y establece el contador a 0
        this.contadorDeFrame = 0;
        
        this.ancho = 1280
        this.alto = 720
<<<<<<< HEAD
        
        this.mouse = { x: 0, y: 0 };
        this.selectedEntities = [];
        this.selectionBox = null;
        this.isSelecting = false;
               
=======


>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
        //this.ancho = window.innerWidth;
        //this.alto = window.innerHeight;

        //-------------------------------------------------------------------------
        this.mousePos = { x: 0, y: 0 };
  
        // Escucha movimiento del mouse
        window.addEventListener('mousemove', (e) => {
          const rect = this.app.view.getBoundingClientRect(); // el canvas
          this.mousePos.x = e.clientX - rect.left;
          this.mousePos.y = e.clientY - rect.top;
        });//----------------------------------------------------------------------

        //this.ancho = window.innerWidth;
        //this.alto = window.innerHeight;

        let promesa = this.app.init({ width: this.ancho, height: this.alto })  //init pertenece a PIXI assets. es para iniciar primero antes que todo

        promesa.then(e => { document.body.appendChild(this.app.canvas); /*Se agrega el lienzo (canvas) generado por PixiJS al cuerpo del documento HTML. 
            Esto hace que el juego se muestre en la página web.*/
            window.__PIXI_APP__ = this.app; /*Asocia la instancia de la aplicación a la variable global window.__PIXI_APP__, lo que puede 
            ser útil para acceder a la aplicación desde otros lugares en el código.*/ 
           
            //--container--
            this.containerPrincipal = new PIXI.Container();
            this.containerPrincipal.name = "el container principal";
            this.app.stage.addChild(this.containerPrincipal);
<<<<<<< HEAD
            //18-05
            this.grid = new Grid(this); // debe instanciar Grid
            this.vectorFieldManager = new VectorFieldManager(this); // si usás campo vectorial
            this.mouseManager = new MouseManager(this);

            this.ponerFondo();//--agrega imagen de fondo
            //this.ponerObrero(1)
            this.ponerObreroRojo(1)
=======
            
            //this.containerPrincipal.addChild(this.chaboncitos);
            
            //this.cargarPuntero()******
            this.ponerFondo();//--agrega imagen de fondo
            
>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
            this.app.ticker.add(() => {
                this.gameLoop()//funcion
            })

            crearCaballerosAzules(1, this.entidades, this.app, this)//nueva funcion

            this.ponerDeathKnight()//funcion

            this.keys = {
                t: false,
                f: false,
                g: false,
                h: false
              };
            this.velocidadCamara = 15;
            this.configurarControles();
            
            //obrero
            this.ponerObrero(1)
            this.cargarPuntero();
            
            // Bloquear menú contextual del botón derecho SOLO en el canvas
            this.app.view.addEventListener('contextmenu', (e) => {
              e.preventDefault();
            });

        })
    }

    async ponerFondo() {
        // Cargar la textura
        let textura = await PIXI.Assets.load("map1.png");
    
        // Crear el TilingSprite con la textura y dimensiones
        this.fondo = new PIXI.TilingSprite(textura, this.ancho *2, this.alto *2);//tamaño del mapa!!!!!!!!!
    
        this.fondo.zIndex = 0; // El fondo siempre tendrá el zIndex más bajo
        this.containerPrincipal.sortableChildren = true; // Habilitar ordenamiento por zIndex
        // Añadir al escenario
        this.containerPrincipal.addChild(this.fondo);
    
        /*
        1 load (carga)
        2 addChild (agrega)
        */

<<<<<<< HEAD
    }

=======
      }
    moverCamara() {
        if (!this.fondo) return;
        // this.containerPrincipal.x = this.protagonista.x;
        // this.containerPrincipal.y = this.protagonista.y;
    
        const cuanto = 0.033333;//Es la cantidad de interpolación o suavizado. Cuanto más chico este valor, más lenta y suave será la transición al nuevo valor de cámara.
        
        //Calcula hacia dónde debería moverse la cámara para que el protagonista quede centrado en la pantalla.
        const valorFinalX = -this.deathKnights.x + this.ancho / 2;//posision del protagonista + ancho total /2
        const valorFinalY = -this.deathKnights.y + this.alto / 2;
        
        //Interpolación lineal (Lerp): mueve suavemente la cámara hacia la posición deseada.
        //No se salta directamente a valorFinalX sino que se va acercando poco a poco, creando un movimiento suave.
        this.containerPrincipal.x -=(this.containerPrincipal.x - valorFinalX) * cuanto;
        this.containerPrincipal.y -=(this.containerPrincipal.y - valorFinalY) * cuanto;
    
        //limites izquierdos X e Y
        if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
        if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;
    
        // limite derecho X
        if (this.containerPrincipal.x < -this.fondo.width + this.ancho) {
          this.containerPrincipal.x = -this.fondo.width + this.ancho;
        }
        // limite derecho Y
        if (this.containerPrincipal.y < -this.fondo.height + this.alto) {
          this.containerPrincipal.y = -this.fondo.height + this.alto;
        }
      }
>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
    //////////////////////////////////////////////////////////////////////////////////////////////////////--gameloop
    gameLoop(time) {
        this.time = time;
        this.contadorDeFrame++;
        /*
        for (let i = 0; i < this.chaboncitos.length; i++) {
            this.chaboncitos[i].update(time);
        }*/

        for (let i = 0; i < this.entidades.length; i++) {
            this.entidades[i].update(time);
        }
    
        for (let i = 0; i < this.deathKnights.length; i++) {
            this.deathKnights[i].update(time);
            /*
            // Verificar colisión con cada chaboncito
            for (let j = this.chaboncitos.length - 1; j >= 0; j--) {
                if (colision(this.deathKnights[i], this.chaboncitos[j])) {

                    //this.deathKnights[i].cambiarEstado('ladoAtk');
                    // Remover sprite del escenario
                    this.app.stage.removeChild(this.chaboncitos[j].sprite);
    
                    // Remover del array
                    this.chaboncitos.splice(j, 1);
                }
            }*/
                
        }
<<<<<<< HEAD
        this.moverCamara();

=======

      for (let i = 0; i < this.trabajador.length; i++) {
          this.trabajador[i].update(time);
      }
        //this.moverCamara();
        this.moverCamara2();
>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
        this.deathKnights.update(time);

    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////--instancia de personaje
    /*fuera 19/05
    ponerChaboncitos2(cantidad) {
    
        for (let i = 0; i < cantidad; i++) {
            this.chaboncitos.push(new CaballeroAzul(Math.random() * 500, Math.random() * 500, this.app, i, this))
            //"push()"carga en el array los personajes 10 veces
        }
    }*/

    ponerChaboncitos(cantidad) {
    
        for (let i = 0; i < cantidad; i++) {
            this.entidades.push(new CaballeroAzul(Math.random() * 500, Math.random() * 500, this.app, i, this))
            //"push()"carga en el array los personajes 10 veces
        }
    }

    ponerDeathKnight(cantidad) {
    
        for (let i = 0; i < cantidad; i++) {
            this.deathKnights.push(new CaballeroRojo(Math.random() * 500, Math.random() * 500, this.app, i, this))
            //"push()"carga en el array los personajes 10 veces
        }
    }

    ponerDeathKnight() {
        let i = 0
        this.deathKnights =new CaballeroRojo(500,500, this.app, i, this)
    }

    ponerObrero(cantidad){
      for(let i =0 ; i< cantidad ;i++){
        const obrero = new Trabajador(200,200, this.app, i, this)
        this.entidades.push(obrero)
      }

    }
    ponerObreroRojo(cantidad){
      for(let i =0 ; i< cantidad ;i++){
        const obrero = new TrabajadorRojo(200,200, this.app, i, this)
        this.entidades.push(obrero)
      }

<<<<<<< HEAD
=======

    cargarPuntero(){// debe inicializarse en la escena
        this.puntero = new Puntero(this.app, this); 
>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
    }

    configurarControles() {
        // Event listener para cuando una tecla es presionada
        window.addEventListener('keydown', (e) => {
          switch(e.key.toLowerCase()) {
            case 't':
              this.keys.t = true;
              break;
            case 'f':
              this.keys.f = true;
              break;
            case 'g':
              this.keys.g = true;
              break;
            case 'h':
              this.keys.h = true;
              break;
          }
        });
        
        // Event listener para cuando una tecla es liberada
        window.addEventListener('keyup', (e) => {
          switch(e.key.toLowerCase()) {
            case 't':
              this.keys.t = false;
              break;
            case 'f':
              this.keys.f = false;
              break;
            case 'g':
              this.keys.g = false;
              break;
            case 'h':
              this.keys.h = false;
              break;
          }
        });
    }

<<<<<<< HEAD
    moverCamara() {
=======
    moverCamara2() {
>>>>>>> e9d9b62525aef4f8166d43d71dca00ef40284de8
        if (!this.fondo) return;
      
        const borde = 30; // margen en px desde el borde donde empieza a moverse
        const { x, y } = this.mousePos;
      
        // Movimiento horizontal
        if (x < borde) {
          this.containerPrincipal.x += this.velocidadCamara;
        } else if (x > this.ancho - borde) {
          this.containerPrincipal.x -= this.velocidadCamara;
        }
      
        // Movimiento vertical
        if (y < borde) {
          this.containerPrincipal.y += this.velocidadCamara;
        } else if (y > this.alto - borde) {
          this.containerPrincipal.y -= this.velocidadCamara;
        }
      
        // Limites izquierdos X e Y
        if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
        if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;
      
        // Limite derecho X
        if (this.containerPrincipal.x < -this.fondo.width + this.ancho) {
          this.containerPrincipal.x = -this.fondo.width + this.ancho;
        }
        // Limite derecho Y
        if (this.containerPrincipal.y < -this.fondo.height + this.alto) {
          this.containerPrincipal.y = -this.fondo.height + this.alto;
        }
    }

}

