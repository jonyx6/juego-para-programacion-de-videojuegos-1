class GendarmeriaHumana extends ObjetosEscenario {
  constructor(juego, col, row) {
    super(juego, col, row);
    this._vida = 100;//11/06/2025--
    this.vidaMaxima = 100;
    this.estadoActual = 'activa';
    this.dirImagen ="assets/hud/casaHumana.jpg"
    this.dirImagen2 = "assets/Estructuras/EdificioAzul_2.png"; // Asegurate que exista
    this.dirImagenDañada = "assets/Estructuras/EdificioAzul_2B.png"; // Sprite dañado
    this.spriteDañadoCargado = false;
  }

  async cargarSprite() {
    const textura = await PIXI.Assets.load(this.dirImagen2);

    this.sprite = new PIXI.Sprite(textura);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.zIndex = 100;

    this.ancho = this.sprite.width;
    this.alto = this.sprite.height;

    this.container.addChild(this.sprite);
    this.listo = true;
  }

  atributos() {
    return (
      "Estado: " + this.estadoActual + "\n" +
      "Vida : " + this.vida + "\n"
    );
  }
  
  // Getter y setter para vida que automáticamente verifica el estado
  get vida() {
    return this._vida;
  }
  set vida(nuevaVida) {
    this._vida = nuevaVida;
    if (this._vida < 0) this._vida = 0;
    this.verificarEstadoPorVida();
    
    if (this._vida <= 0) {
      this.estadoActual = 'destruida';
    }
  }

  // Método para cambiar al sprite dañado
  async cambiarASpriteDañado() {
    if (this.spriteDañadoCargado) return; // Evitar cambiar múltiples veces

    try {
      // Cargar la textura del sprite dañado y cambiarla directamente
      const texturaDañada = await PIXI.Assets.load(this.dirImagenDañada);
      this.sprite.texture = texturaDañada;
      
      // Actualizar dimensiones si es necesario
      this.ancho = this.sprite.width;
      this.alto = this.sprite.height;
      
      this.spriteDañadoCargado = true;
      this.estadoActual = 'dañada';
      
    } catch (error) {
      console.error("Error al cargar sprite dañado:", error);
    }
  }

  // Método para verificar y cambiar sprite según el daño
  verificarEstadoPorVida() {
    const porcentajeVida = (this.vida / this.vidaMaxima) * 100;
    
    if (porcentajeVida <= 50 && !this.spriteDañadoCargado) {
      this.cambiarASpriteDañado();
    }
  }
}//---------------------------------------------------------------------------------------------------