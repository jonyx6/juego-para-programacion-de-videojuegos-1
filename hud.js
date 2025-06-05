class UI{
    constructor(juego){
        this.juego =juego;
        this.crearContainer();
        this.agregarImagen();
     
        
        this.textoEnPantalla= new PIXI.Text("textoEnPantalla",{
            fontFamily:"Arial",
            fontSize : 24,
            fill:"#ffffff",
        });
        this.textoEnPantalla.x = 10;
        this.textoEnPantalla.y = 5;
        this.textoEnPantalla.text ="hola jony como estas?"
        this.textoEnPantalla.zIndex=100
        this.container.addChild(this.textoEnPantalla);
    };

    crearContainer() {
    this.container = new PIXI.Container();
    this.container.name = "interfaz";
    this.container.y= juego.alto *0.9
    this.juego.containerPrincipal.addChild(this.container);
    this.container.zIndex =200
    }

    async agregarImagen(){
        const interfaz = await PIXI.Assets.load("./assets/hud/menuItems.png");
        const interfazSprite = new PIXI.Sprite(interfaz); // corregido acá
        interfazSprite.anchor.set(0);
        interfazSprite.x = 0;
        interfazSprite.y = 0;
        this.container.addChild(interfazSprite);
    }

    mostrarAtributosDe_(variosPersonajes){
        this.textoEnPantalla.text =variosPersonajes;
    }   
    


    

}