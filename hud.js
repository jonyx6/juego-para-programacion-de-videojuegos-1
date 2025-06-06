class UI {
    constructor(juego) {
        this.juego = juego;
        this.crearContainer();

        // Crear primero el texto para evitar que se borre por accidente
        this.textoEnPantalla = new PIXI.Text("textoEnPantalla", {
            fontFamily: "MedievalSharp",
            fontSize: 24,
            fill: "#ffffff",
        });
        this.textoEnPantalla.x = 325;
        this.textoEnPantalla.y = -70;
        this.textoEnPantalla.text = "hola jony como estas?";
        this.textoEnPantalla.zIndex = 100;
        this.containerHud.addChild(this.textoEnPantalla);

        this.agregarImagen();
        this.agregarImagen2();

        this.fotoActual = null; // Para almacenar la imagen actual del personaje
    }

    crearContainer() {
        this.containerHud = new PIXI.Container();
        this.containerHud.name = "interfaz";
        this.containerHud.y = this.juego.alto * 0.9;
        this.juego.containerPrincipal.addChild(this.containerHud);
        this.containerHud.zIndex = 200;
    }

    async agregarImagen() {
        const interfaz = await PIXI.Assets.load("./assets/hud/para sus atributos.png");
        const interfazSprite = new PIXI.Sprite(interfaz);
        interfazSprite.anchor.set(0);
        interfazSprite.x = 260;
        interfazSprite.y = -180;
        interfazSprite.zIndex = 1;
        this.containerHud.addChild(interfazSprite);
    }

    async agregarImagen2() {
        const interfaz = await PIXI.Assets.load("./assets/hud/paraLaFotoDelPj.png");
        const interfazSprite = new PIXI.Sprite(interfaz);
        interfazSprite.anchor.set(0);
        interfazSprite.x = 5;
        interfazSprite.y = -290;
        interfazSprite.zIndex = 1;
        this.containerHud.addChild(interfazSprite);
    }

    async agregarImagenDe_(ruta) {
        console.log("Intentando cargar imagen:", ruta);
        if (!ruta) {
            console.warn("Ruta de imagen no definida");
            return;
        }

        const textura = await PIXI.Assets.load(ruta);
        const sprite = new PIXI.Sprite(textura);
        sprite.anchor.set(0);
        sprite.x = 50;
        sprite.y = -200;
        sprite.zIndex = 10;
        sprite.scale.set(0.17);

        // Eliminar la imagen anterior si existía
        if (this.fotoActual) {
            this.containerHud.removeChild(this.fotoActual);
        }

        this.fotoActual = sprite;
        this.containerHud.addChild(sprite);
    }

    mostrarAtributosDe_(variosPersonajes) {
        console.log("Mostrando atributos:", variosPersonajes);
        this.textoEnPantalla.text = variosPersonajes;
    }

    subir() {
        this.containerHud.y = this.juego.alto * 0.9;
        console.log("hud subio");
    }

    bajar() {
        this.containerHud.y = this.juego.alto * 2;
        console.log("hud abajo");
    }
}
