/*class Puntero {
    constructor(app, juego) {
        this.app = app;
        this.juego = juego;
        this.animaciones = {};
        this.personajesSeleccionados = [];
        this.crearContainer();
        this.cargarSpritesAnimados(); // inicia todo dentro
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.juego.containerPrincipal.addChild(this.container);
    }

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('assets/cursor/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.play();
        this.listo = true;

        this.container.addChild(this.sprite);
        this.iniciarEventos();
        this.app.view.style.cursor = 'none';
    }

    iniciarEventos() {
        this.app.stage.eventMode = 'static';
        this.app.stage.on('pointerdown', this.detectarClicEnPersonaje.bind(this));
        
        this.app.stage.on('pointerdown', this.detectarClicDerecho.bind(this));

        this.app.stage.on("pointermove", (evento) => {
            if (this.sprite) {
                const posicion = evento.global;
                this.sprite.x = posicion.x;
                this.sprite.y = posicion.y;
            }
        });
    }


    detectarClicEnPersonaje(evento) {
        const posicion = evento.global;
        if (this.juego && this.juego.personajes) {
            this.deseleccionarPersonajes();
            const personajeClickeado = this.juego.personajes.find(p => {
                const area = p.sprite.getBounds();
                return this.estaDentroDelSprite(posicion, area);
            });
            if (personajeClickeado) {
                this.personajesSeleccionados = [personajeClickeado];
                personajeClickeado.seleccionar();
                personajeClickeado.emitirSonidoAleatorio();
                
            }
        } else {
            console.error("No se encontraron personajes en juego.");
        }
    }

    estaDentroDelSprite(pos, area) {
        return (
            pos.x >= area.x &&
            pos.x <= area.x + area.width &&
            pos.y >= area.y &&
            pos.y <= area.y + area.height
        );
    }

    deseleccionarPersonajes() {
        if (this.personajesSeleccionados?.length > 0) {
            this.personajesSeleccionados.forEach(p => p.deseleccionar());
        }
    }

    ordenarMover(posicion) {
        for (let p of this.personajesSeleccionados) {
            if (typeof p.moverA === "function") {
                p.moverA(posicion.x, posicion.y);
            }
        }
    }

    detectarClicDerecho(evento) {
        if (evento.data.originalEvent.button === 2) {
            const posicion = evento.global;
            this.ordenarMover(posicion);
        }
    }
}*/
