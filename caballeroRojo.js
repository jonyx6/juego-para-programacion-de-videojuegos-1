class CaballeroRojo extends Personaje{
  constructor(x, y, app, i, juego) {
    
    super(x, y, app, i, juego);
    this.cargarSpriteAnimado();
    this.dirImagen ="assets/hud/jineteRojo.jpg"
    this.vida = 10;
    this.velocidad = 3;

    //variables configurables
    this.puntoDeAtaque = { x: 1500, y: 500 }; // lugar donde se dirigen luego de reunirse
    this.radioPatrulla = 192; // parámetro ajustable
    this.enEspera = false; //maquina de estados
    this.estado = 'patrullando'; //maquina de estados
    this.radioDeAgrupacion = 192;// radio en el cual se van a agrupar
    this.tiempoEspera = 2000 + Math.random() * 2000; //varia entre 2 a 4 segundos
    this.rangoDeVista = 128;
    //this.posicionInicial = { x, y };
    //this.tiempoProximaPatrulla = 0;
  }

  async cargarSpriteAnimado() {
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
      
      idleArri: json.animations["idleArri"],
      idleDiaArri: json.animations["idleDiaArri"],
      idleLado: json.animations["idleLado"],
      idleDiaAbaj: json.animations["idleDiaAbaj"],
      idleAbaj: json.animations["idleAbaj"],
    };

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idleAbaj']);
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

  irA() {}//blanquea los metodos para que no use los del mouse
  irA_v2() {}

  irAInterno(destX, destY) {//es el nuevo irA()
    const origen = this.juego.grid.getCellAt(this.x, this.y);
    const destino = this.juego.grid.getCellAt(destX, destY);
    if (origen && destino) {
      this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino);
    }
  }

  PatrullarLugar(radio) { // se mueve de forma aleatoria cada un tiempo en un determinado radio
    if (this.estado !== 'patrullando' || this.camino.length > 0 || this.enEspera) return;
    
    const origenCelda = this.juego.grid.getCellAt(this.x, this.y);
    if (!origenCelda) return;

    const celdasValidas = this.juego.grid.cells.filter(celda => {
      if (celda.blocked) return false;
      const dx = celda.centerX - origenCelda.centerX;
      const dy = celda.centerY - origenCelda.centerY;
      return Math.hypot(dx, dy) <= radio;
    });

    if (celdasValidas.length > 0) {
      const aleatoria = celdasValidas[Math.floor(Math.random() * celdasValidas.length)];
      this.irAInterno(aleatoria.centerX, aleatoria.centerY);

      this.enEspera = true;
      this.cambiarEstadoIdlePorDireccion();

      setTimeout(() => {
        this.enEspera = false;
      }, this.tiempoEspera);
    }
  }

  AgruparseParaAtaque() {// cuando detecta que esta cerca de un alidado, se juntan y se dirijen a un destino
    if (this.estado !== 'patrullando') return;
    const aliados = this.juego.caballerosRojos?.filter(
      aliado => aliado !== this && Math.hypot(this.x - aliado.x, this.y - aliado.y) < this.radioDeAgrupacion
    ) || [];
    if (aliados.length >= 1) {
      this.estado = 'agrupando';
      this.irAInterno(this.puntoDeAtaque.x, this.puntoDeAtaque.y);
    }
  }

  detectarYAtacarEnemigos(rango) {// si detecta que hay un enemigo cerca, va a atacarlo
    if (!this.enemigos) return;
    const enemigos = typeof this.enemigos === 'function' ? this.enemigos() : this.enemigos;
    for (const enemigo of enemigos) {
      if (!enemigo || enemigo.vida <= 0) continue;
      const dist = Math.hypot(this.x - enemigo.x, this.y - enemigo.y);
      if (dist <= rango) {
        this.estado = 'atacando';
        this.irAInterno(enemigo.x, enemigo.y);
        return;
      }
    }
    if (this.estado === 'atacando' && this.camino.length === 0 && !this.atacando) {
      this.estado = 'agrupando';
    }
  }

  update(time) {
    super.update(time);
    this.detectarYAtacarEnemigos(this.rangoDeVista);
    if (this.estado === 'patrullando') {
      this.PatrullarLugar(this.radioPatrulla);
      this.AgruparseParaAtaque();
    } else if (this.estado === 'agrupando') {
      this.irAInterno(this.puntoDeAtaque.x, this.puntoDeAtaque.y);
    }
  }
}
