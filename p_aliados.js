class Aliados extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    
    // Propiedades específicas para atacar estructuras enemigas
    this.rangoAtaqueEstructura = 192;
    this.estructuraEnemigaObjetivo = null;
    this.destinoGuardado = null;
  }

  detectarEstructuraEnemigaVecina() {
    if (!this.juego?.objetosDeEscenarioRojos) return;

    for (const estructura of this.juego.objetosDeEscenarioRojos) {
      if (!estructura.listo || estructura.vida <= 0) continue;

      const celdasVecinas = estructura.obtenerCeldasVecinasLibres?.();
      if (!celdasVecinas) continue;

      const miCelda = this.juego.grid.getCellAt(this.x, this.y);
      if (!miCelda) continue;

      const estoyEnVecina = celdasVecinas.some(
        celda => celda.col === miCelda.col && celda.row === miCelda.row
      );

      if (estoyEnVecina) {
        if (!this.estructuraEnemigaObjetivo) {
          this.destinoGuardado = this.destinoFijado; // Guardar destino solo la primera vez
        }
        this.estructuraEnemigaObjetivo = estructura;
        return;
      }
    }

    this.estructuraEnemigaObjetivo = null;
  }

  atacarEstructuraEnemiga() {
    const obj = this.estructuraEnemigaObjetivo;
    if (!obj || obj.vida <= 0) return;

    const dx = obj.container.x - this.x;
    const dy = obj.container.y - this.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia <= this.rangoAtaqueEstructura && !this.atacando) {
      this.camino = []; // 🛑 Detener movimiento
      const anim = this.obtenerAnimacionDeAtaque(dx, dy);
      this.orientarSprite(dx);
      this.objetivoAtaque = obj;
      this.reproducirAnimacionDeAtaque(anim, obj);

      obj.vida -= 0.1; // ⚔️ Daño por frame

      if (obj.vida <= 0) {
        obj.morir?.();
        this.estructuraEnemigaObjetivo = null;

        // 🔁 Retomar destino anterior si lo había
        if (this.destinoGuardado) {
          this.irA(this.destinoGuardado.x, this.destinoGuardado.y);
          this.destinoGuardado = null;
        }
      }
    }
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

  update(time) {
    super.update(time);

    this.detectarEstructuraEnemigaVecina();

    if (this.estructuraEnemigaObjetivo) {
      this.atacarEstructuraEnemiga();
    }
  }
}