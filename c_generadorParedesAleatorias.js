//////////////////////////////////////////////////////////////////////////v2
class GeneradorParedesAleatorias {
  constructor(grid) {
    this.grid = grid;
  }

  // Método principal para generar paredes aleatorias
  generarParedesAleatorias(porcentaje = 0.15) {
    const totalCeldas = this.grid.cells.length;
    const cantidadParedes = Math.floor(totalCeldas * porcentaje);
    
    console.log(`Generando ${cantidadParedes} paredes de ${totalCeldas} celdas totales`);
    
    // Resetear todas las celdas
    this.grid.cells.forEach(celda => {
      celda.blocked = false;
    });
    
    // Generar paredes aleatorias
    for (let i = 0; i < cantidadParedes; i++) {
      const indiceAleatorio = Math.floor(Math.random() * totalCeldas);
      const celda = this.grid.cells[indiceAleatorio];
      
      // No bloquear celdas que ya están bloqueadas
      if (!celda.blocked) {
        celda.blocked = true;
      }
    }
    
    console.log('Paredes generadas exitosamente');
  }

  // Método mejorado que evita bloquear completamente el mapa
  generarParedesInteligentes(porcentaje = 0.15) {
    const totalCeldas = this.grid.cells.length;
    const cantidadParedes = Math.floor(totalCeldas * porcentaje);
    
    // Resetear todas las celdas
    this.grid.cells.forEach(celda => {
      celda.blocked = false;
    });
    
    // Obtener esquinas del mapa para no bloquearlas
    const esquinas = this.obtenerEsquinas();
    
    let paredesCreadas = 0;
    let intentos = 0;
    const maxIntentos = cantidadParedes * 3;
    
    while (paredesCreadas < cantidadParedes && intentos < maxIntentos) {
      const indiceAleatorio = Math.floor(Math.random() * totalCeldas);
      const celda = this.grid.cells[indiceAleatorio];
      
      // No bloquear si:
      // 1. Ya está bloqueada
      // 2. Es una esquina importante
      // 3. Bloquearía completamente una zona
      if (!celda.blocked && 
          !this.esEsquinaImportante(celda, esquinas) &&
          !this.bloqueariaCompletamente(celda)) {
        
        celda.blocked = true;
        paredesCreadas++;
      }
      
      intentos++;
    }
    
    console.log(`Paredes inteligentes generadas: ${paredesCreadas}/${cantidadParedes}`);
  }

  // Generar patrones específicos de paredes
  generarPatronLaberinto() {
    // Resetear
    this.grid.cells.forEach(celda => {
      celda.blocked = false;
    });
    
    // Crear patrón de laberinto simple
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        // Crear paredes cada 3 celdas en patrón de rejilla
        if ((row % 3 === 0 && col % 2 === 1) || 
            (col % 3 === 0 && row % 2 === 1)) {
          const celda = this.grid.getCellAt(col * this.grid.cellSize, row * this.grid.cellSize);
          if (celda && Math.random() > 0.3) { // 70% probabilidad
            celda.blocked = true;
          }
        }
      }
    }
    
    console.log('Patrón de laberinto generado');
  }

  // Limpiar todas las paredes
  limpiarParedes() {
    this.grid.cells.forEach(celda => {
      celda.blocked = false;
    });
    console.log('Todas las paredes han sido limpiadas');
  }

  // === Métodos auxiliares ===
  
  obtenerEsquinas() {
    return [
      this.grid.getCellAt(0, 0), // Superior izquierda
      this.grid.getCellAt((this.grid.cols - 1) * this.grid.cellSize, 0), // Superior derecha
      this.grid.getCellAt(0, (this.grid.rows - 1) * this.grid.cellSize), // Inferior izquierda
      this.grid.getCellAt(
        (this.grid.cols - 1) * this.grid.cellSize, 
        (this.grid.rows - 1) * this.grid.cellSize
      ) // Inferior derecha
    ].filter(celda => celda !== null);
  }
  
  esEsquinaImportante(celda, esquinas) {
    return esquinas.includes(celda);
  }
  
  bloqueariaCompletamente(celda) {
    // Verificar si bloquear esta celda dejaría sin salida a alguna zona
    const vecinos = celda.getNeighbors();
    const vecinosLibres = vecinos.filter(v => !v.blocked);
    
    // Si tiene muy pocos vecinos libres, probablemente bloquearía una zona
    return vecinosLibres.length <= 1;
  }

  // === Métodos de compatibilidad con el código original ===
  
  aplicar(previous, indiceDestino) {
    // Este método es para compatibilidad con tu código original
    // pero ahora usa la nueva lógica
    this.generarParedesAleatorias(0.15);
    
    const celdas = this.grid.cells;

    for (let i = 0; i < celdas.length; i++) {
      const celda = celdas[i];

      if (celda.blocked) {
        this._bloquearVector(celda);
        continue;
      }

      const sinCamino = previous && previous[i] === null && i !== indiceDestino;
      if (sinCamino) {
        this._asignarVectorAleatorio(celda);
      }
    }
  }

  _bloquearVector(celda) {
    if (this.grid.setVector) {
      this.grid.setVector(celda.col, celda.row, { x: 0, y: 0 });
    }
  }

  _asignarVectorAleatorio(celda) {
    const aleatorio = () => (Math.random() - 0.5) * 0.1;

    if (this.grid.setVector) {
      this.grid.setVector(celda.col, celda.row, {
        x: aleatorio(),
        y: aleatorio()
      });
    }
  }
}

window.GeneradorParedesAleatorias = GeneradorParedesAleatorias;