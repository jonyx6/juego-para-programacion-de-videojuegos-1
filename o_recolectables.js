class Recolectable extends ObjetosEscenario {
  constructor(juego, col, row) {
    super(juego, col, row);
    this.vida = 10;
    this.estadoActual = 'activo';
    this.trabajadoresAsignados = [];
  }

  recibirDanio(cantidad) {
    this.vida -= cantidad;
    if (this.vida <= 0) this.destruir();
  }

  destruir() {
    this.estadoActual = 'muerto';
    this.juego.grid.desbloquearCelda(this.col, this.row);

    const lista = this.juego.objetosDeEscenario;
    const index = lista.indexOf(this);
    if (index !== -1) lista.splice(index, 1);

    this.container?.destroy();
    this.sprite?.destroy();

    for (const trabajador of this.trabajadoresAsignados) {
      trabajador.recursoAsignado = null;
    }

    this.trabajadoresAsignados = [];
  }

  asignarTrabajador(trabajador) {
    if (!this.trabajadoresAsignados.includes(trabajador)) {
      this.trabajadoresAsignados.push(trabajador);
    }
  }

  liberarTrabajador(trabajador) {
    const index = this.trabajadoresAsignados.indexOf(trabajador);
    if (index !== -1) this.trabajadoresAsignados.splice(index, 1);
  }

  estaDisponible() {
    return this.estadoActual !== 'muerto';
  }

  obtenerCeldaVecinaMasCercanaA(x, y) {
    const celdas = this.obtenerCeldasVecinasLibres();
    let mejorCelda = null;
    let menorDist = Infinity;

    for (const celda of celdas) {
      const dx = celda.centerX - x;
      const dy = celda.centerY - y;
      const dist = dx * dx + dy * dy;

      if (dist < menorDist) {
        menorDist = dist;
        mejorCelda = celda;
      }
    }

    return mejorCelda;
  }
}
