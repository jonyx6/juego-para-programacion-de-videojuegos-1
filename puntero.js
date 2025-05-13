class Puntero {
    constructor(app, juego) {
        this.app = app;
        this.juego = juego;
        this.personajesSeleccionados = [];
        this.iniciarEventos();
    }

    iniciarEventos() {
        
        //  quiero que el escenario detecte clics. Y cuando alguien haga clic, ejecutá mi función detectarClicEnPersonaje."
        this.app.stage.eventMode = 'static'; // le decis al stage que escuche eventos.
        this.app.stage.on('pointerdown', this.detectarClicEnPersonaje.bind(this));

          // Detectar clic derecho.
        this.app.stage.on('pointerdown', this.detectarClicDerecho.bind(this));
    }

    detectarClicEnPersonaje(evento) {
        const posicion = evento.global;
    
        if (this.juego && this.juego.personajes) {//?

            this.deseleccionarPersonajes()
            const personajeClickeado = this.juego.personajes.find(p => {
                const areaDelSprite = p.sprite.getBounds();
                return (
                    this.estaDentroDelSprite(posicion,areaDelSprite)
                );
            });
    
            if (personajeClickeado) {
                this.personajesSeleccionados = [personajeClickeado];
                personajeClickeado.seleccionar();
            } else {
                 //this.ordenarMover(posicion); 
            }
        } else {
            console.error("No se encontraron personajes en juego.");
        }

    }

    estaDentroDelSprite(unaPosicion, unSprite) {
         return (
            unaPosicion.x >= unSprite.x &&
            unaPosicion.x <= unSprite.x + unSprite.width &&
            unaPosicion.y >= unSprite.y &&
            unaPosicion.y <= unSprite.y + unSprite.height
        );
    }

    deseleccionarPersonajes() {
        if (this.personajesSeleccionados && this.personajesSeleccionados.length > 0) {
            this.personajesSeleccionados.forEach(p => p.deseleccionar());
        }
    }
    
    ordenarMover2(posicion) {
        for (let p of this.personajesSeleccionados) {
            p.moverA(posicion.x, posicion.y); // Método que deberás definir
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
    // Verificamos si el clic fue derecho (botón 2 del ratón).
        if (evento.data.originalEvent.button === 2) { // button 2 es el clic derecho
         const posicion = evento.global;
        // Aquí llamamos a ordenarMover sin necesidad de hacer nada con personajes.
            this.ordenarMover(posicion);
        }
    }
}
