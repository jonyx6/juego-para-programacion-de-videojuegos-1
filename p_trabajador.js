class Trabajador extends Personaje {
    constructor(x, y, app, i, juego) {
        super(x, y, app, i, juego);
        this.sonidos = [];
        this.cargarSpriteAnimado()

    }

    async cargarSonidosAleatorios() {
      
        const rutas = [
            //'assets/sonidoObrero/me vas a hacer negrear no.mp3',
            //'assets/sonidoObrero/que negrero.mp3',
            //'assets/sonidoObrero/que queres.mp3',
            'assets/sonidoObrero/vamo a chambear.mp3'
        ];

        for (let ruta of rutas) {
            await PIXI.Assets.load(ruta);
            this.sonidos.push(ruta);
        }
    }


    emitirSonidoAleatorio() {
        if (this.sonidos.length === 0) {
        console.warn("No hay sonidos cargados");
        return;
        }

      if (this.sonidos?.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.sonidos.length);
          const ruta = this.sonidos[randomIndex];
          PIXI.sound.play(ruta);
      }
    }


    async cargarSpriteAnimado() {

        debugger;
        let json = await PIXI.Assets.load('assets/peonNew/texture.json');
        let jsonDeMuerte = await PIXI.Assets.load('assets/peonmuriendo/texture.json')
        let jsonPicando = await PIXI.Assets.load('assets/peonpicando/texture.json')
        let jsonRecolectandomadera = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json')
        let jsonRecolectandoOro = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json')
        this.animaciones['idle'] = json.animations["idle"];
        this.animaciones['walk_up'] = json.animations["walk_up"];
        this.animaciones['walk_down'] = json.animations["walk_down"];
        this.animaciones['walk_right_up'] = json.animations["walk_right_up"];
        this.animaciones['walk_right'] = json.animations["walk_right"];
        this.animaciones['walk_right_down'] = json.animations["walk_right_down"];
        //muerte
        this.animaciones['muerte1'] = jsonDeMuerte.animations["muerte1"];
        this.animaciones['muerte2'] = jsonDeMuerte.animations["muerte2"];
        //picando 
        this.animaciones['picando_up'] = jsonPicando.animations["picando_up"];
        this.animaciones['picando_down'] = jsonPicando.animations["picando_down"];
        this.animaciones['picando_right_up'] = jsonPicando.animations["picando_right_up"];
        this.animaciones['picando_right'] = jsonPicando.animations["picando_right"];
        this.animaciones['picando_right_down'] = jsonPicando.animations["picando_right_down"];
        //RECOLECTANDO MADERA
        this.animaciones['recolectandoMadera_up'] = jsonRecolectandomadera.animations["recolectandoMadera_up"];
        this.animaciones['recolectandoMadera_down'] = jsonRecolectandomadera.animations["recolectandoMadera_down"];
        this.animaciones['recolectandoMadera_right_up'] = jsonRecolectandomadera.animations["recolectandoMadera_right_up"];
        this.animaciones['recolectandoMadera_right'] = jsonRecolectandomadera.animations["recolectandoMadera_right"];
        this.animaciones['recolectandoMadera_right_down'] = jsonRecolectandomadera.animations["recolectandoMadera_right_down"];
        // recolectando oro
        this.animaciones['recolectandoOro_up'] = jsonRecolectandoOro.animations["recolectandoOro_up"];
        this.animaciones['recolectandoOro_down'] = jsonRecolectandoOro.animations["recolectandoOro_down"];
        this.animaciones['recolectandoOro_right_up'] = jsonRecolectandoOro.animations["recolectandoOro_right_up"];
        this.animaciones['recolectandoOro_right'] = jsonRecolectandoOro.animations["recolectandoOro_right"];
        this.animaciones['recolectandoOro_right_down'] = jsonRecolectandoOro.animations["recolectandoOro_right_down"];

        
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