//18/06/2025 todo
class Enemigos extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);

    // IA general
    this.estado = 'patrullando';
    this.enEspera = false;
    this.radioDeAgrupacion = 192;
    this.radioPatrulla = 192;
    this.tiempoEspera = 2000 + Math.random() * 2000;
    this.rangoDeVista = 128;
    this.rangoAtaqueEstructura = 192;

    this.objetivoActual = null;
    this.cantidadParaAgruparse = 4;
  }
  
  update(time) {// Y modificar el switch en update() para manejar el estado 'agrupando'
    super.update(time);
    this.detectarYAtacarEnemigos(this.rangoDeVista);
    
    switch (this.estado) {
      case 'patrullando':
        this.manejarPatrulla();
        break;
      case 'atacandoEstructura':
        this.manejarAtaqueEstructura();
        break;
      case 'agrupando':
        this.buscarSiguienteObjetivo(); // usar método dedicado
        break;
    }
  }

  irAInterno(destX, destY) {//es el nuevo irA()
    const origen = this.juego.grid.getCellAt(this.x, this.y);
    const destino = this.juego.grid.getCellAt(destX, destY);
    if (origen && destino) {
      this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino);
    }
  }

  PatrullarLugar(radio) { // se mueve de forma aleatoria cada un tiempo en un determinado radio
    if (this.estado !== 'patrullando' || this.camino.length > 0 || this.enEspera) return;
    console.log("PatrullarLugar");
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

  AgruparseParaAtaque() {
    //console.log("Intentando agruparse...");
    //console.log("Cantidad de casas azules disponibles:", this.juego.objetosDeEscenarioAzules.length);
    if (this.estado !== 'patrullando') return;
    //console.log("AgruparseParaAtaque");
    const aliados = this.juego.entidadesEnemigas?.filter(
      aliado => aliado !== this && Math.hypot(this.x - aliado.x, this.y - aliado.y) < this.radioDeAgrupacion
    ) || [];
    
    //console.log("Aliados detectados cerca:", aliados.length);
    if (aliados.length >= this.cantidadParaAgruparse) {
      const objetivos = this.juego.objetosDeEscenarioAzules || [];

      let menorDistancia = Infinity;
      let objetivoCercano = null;
      //console.log("Objetivos posibles:", this.juego.objetosDeEscenarioAzules?.length);
      for (const obj of objetivos) {
        if (!obj.listo || obj.vida <= 0) continue;
        const dist = Math.hypot(this.x - obj.container.x, this.y - obj.container.y);
        if (dist < menorDistancia) {
          menorDistancia = dist;
          objetivoCercano = obj;
        }
      }

      if (objetivoCercano) {
        let mejorCelda = null;
        let menorDistanciaCelda = Infinity;

        const celdasCandidatas = objetivoCercano.obtenerCeldasVecinasLibres();

        for (const celda of celdasCandidatas) {
          const dx = celda.centerX - this.x;
          const dy = celda.centerY - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < menorDistanciaCelda) {
            menorDistanciaCelda = dist;
            mejorCelda = celda;
          }
        }

        if (mejorCelda) {
          this.estado = 'atacandoEstructura';
          this.objetivoActual = objetivoCercano;
          this.irAInterno(mejorCelda.centerX, mejorCelda.centerY);
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
  
  detectarYAtacarEnemigos(rango) {// si detecta que hay un enemigo cerca, va a atacarlo
    if (!this.enemigos) return;
    console.log("detectarYAtacarEnemigos");
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

  manejarPatrulla() {
    this.PatrullarLugar(this.radioPatrulla);
    this.AgruparseParaAtaque();
  }

  manejarAtaqueEstructura() {
    if (this.validarObjetivo()) {
      this.ejecutarAtaque();
    }
  }

  validarObjetivo() {
    if (!this.objetivoActual || this.objetivoActual.vida <= 0) {
      //console.log("Sin objetivo o ya destruido");
      return this.manejarObjetivoDestruido();
    }
    return true;
  }
  
  ejecutarAtaque() {
    const { dx, dy, distancia } = this.calcularDistanciaAlObjetivo();
    
    if (distancia <= this.rangoAtaqueEstructura) {
      // CAMBIO: Reemplazar realizarAnimacionAtaque por reproducirAnimacionDeAtaque
      const anim = this.obtenerAnimacionDeAtaque(dx, dy);
      if (anim) {
        // Orientar el sprite antes del ataque
        this.orientarSprite(dx);
        this.objetivoAtaque = this.objetivoActual;
        // Usar el método heredado de Personaje
        this.reproducirAnimacionDeAtaque(anim, this.objetivoActual);
        //console.log("reproducirAnimacionDeAtaque caballero");
      }
      
      // OPCIONAL: Mantener aplicarDanio si quieres daño continuo por frame
      // Si no, el daño se aplicará cuando termine la animación
      this.aplicarDanio();
      //console.log("aplicar daño caballero");
    }
  }

  calcularDistanciaAlObjetivo() {
    const dx = this.objetivoActual.container.x - this.x;
    const dy = this.objetivoActual.container.y - this.y;
    const distancia = Math.hypot(dx, dy);
    
    return { dx, dy, distancia };
  }

  aplicarDanio() {
    if (!this.objetivoActual || this.objetivoActual.vida <= 0) return;
    
    console.log("Atacando casa, vida actual:", this.objetivoActual.vida);
    this.objetivoActual.vida -= 0.1; // daño por frame
    
    if (this.objetivoActual.vida <= 0) {
      this.objetivoActual.morir?.();
      this.objetivoActual = null;
      this.estado = 'agrupando';
    }
  }
  
  buscarSiguienteObjetivo() {
    const objetivos = this.juego.objetosDeEscenarioAzules || [];
    console.log("Buscando siguiente objetivo. Disponibles:", objetivos.length);
    
    let menorDistancia = Infinity;
    let objetivoCercano = null;
    
    for (const obj of objetivos) {
      if (!obj.listo || obj.vida <= 0) continue;
      const dist = Math.hypot(this.x - obj.container.x, this.y - obj.container.y);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        objetivoCercano = obj;
      }
    }

    if (objetivoCercano) {
      const celdasCandidatas = objetivoCercano.obtenerCeldasVecinasLibres();
      let mejorCelda = null;
      let menorDistanciaCelda = Infinity;

      for (const celda of celdasCandidatas) {
        const dx = celda.centerX - this.x;
        const dy = celda.centerY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < menorDistanciaCelda) {
          menorDistanciaCelda = dist;
          mejorCelda = celda;
        }
      }

      if (mejorCelda) {
        console.log("Nuevo objetivo encontrado:", objetivoCercano);
        this.estado = 'atacandoEstructura';
        this.objetivoActual = objetivoCercano;
        this.irAInterno(mejorCelda.centerX, mejorCelda.centerY);
        return true;
      }
    }
    
    console.log("No hay más objetivos disponibles");
    this.estado = 'patrullando';
    return false;
  }
  // Modificar manejarObjetivoDestruido para usar el nuevo método
  manejarObjetivoDestruido() {
    const hayMasCasas = this.juego.objetosDeEscenarioAzules.length > 0;
    
    if (hayMasCasas) {
      this.buscarSiguienteObjetivo(); // método dedicado
    } else {
      console.log("No quedan casas. Volviendo a patrullar.");
      this.estado = 'patrullando';
    }
    
    return false;
  }
}

window.Enemigos = Enemigos;
